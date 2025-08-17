import { Request, Response } from 'express';
import { createSuccessResponse, createValidationErrorResponse, createServerErrorResponse } from '../../shared/utils/apiResponse';
import { GetTariffsUseCase } from '../../domain/usecases/GetTariffsUseCase';
import { GetAvailableDatesUseCase } from '../../domain/usecases/GetAvailableDatesUseCase';
import { UpdateTariffsUseCase } from '../../domain/usecases/UpdateTariffsUseCase';
import { logger } from '../../shared/utils/logger';
import { Validator } from '../../shared/utils/Validator';

export class TariffsController {
    constructor(
        private readonly getTariffsUseCase: GetTariffsUseCase,
        private readonly getAvailableDatesUseCase: GetAvailableDatesUseCase,
        private readonly updateTariffsUseCase: UpdateTariffsUseCase
    ) { }

    async getTariffsByDate(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.params;
            if (!date) {
                const response = createValidationErrorResponse('Date parameter is required');
                res.status(400).json(response);
                return;
            }

            const targetDate = new Date(date);
            try {
                Validator.validateDate(targetDate);
            } catch (e) {
                const response = createValidationErrorResponse((e as Error).message);
                res.status(400).json(response);
                return;
            }

            logger.info('Fetching tariffs by date via API', {
                context: 'TariffsController.getTariffsByDate',
                metadata: { date: date }
            });

            const result = await this.getTariffsUseCase.execute(date);
            if (!result || !result.metadata) {
                res.status(404).json(createValidationErrorResponse('No data for the specified date'));
                return;
            }

            // Приводим casing метаданных к camelCase
            const response = createSuccessResponse({
                date: result.date,
                metadata: {
                    id: result.metadata.id,
                    date: result.metadata.date,
                    dtTillMax: result.metadata.dt_till_max,
                    createdAt: result.metadata.created_at,
                    updatedAt: result.metadata.updated_at
                },
                tariffs: result.tariffs,
                count: result.count,
                timestamp: result.timestamp
            }, 'Tariffs retrieved successfully');

            res.status(200).json(response);
        } catch (error) {
            logger.error('Failed to get tariffs by date via API', {
                context: 'TariffsController.getTariffsByDate',
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'TariffsController.getTariffsByDate',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            const response = createServerErrorResponse('Internal server error while fetching tariffs');
            res.status(500).json(response);
        }
    }

    async getAvailableDates(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Getting available dates via API', {
                context: 'TariffsController.getAvailableDates'
            });
            const result = await this.getAvailableDatesUseCase.execute();
            const response = createSuccessResponse(result, 'Available dates retrieved successfully');
            res.status(200).json(response);

        } catch (error) {
            logger.error('Failed to get available dates via API', {
                context: 'TariffsController.getAvailableDates',
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'TariffsController.getAvailableDates',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            const response = createServerErrorResponse('Internal server error while fetching available dates');
            res.status(500).json(response);
        }
    }

    async syncTariffs(req: Request, res: Response): Promise<void> {
        try {
            const targetDate = new Date();

            logger.info('Starting manual tariffs synchronization', {
                context: 'TariffsController.syncTariffs',
                metadata: { date: targetDate.toISOString() }
            });

            await this.updateTariffsUseCase.execute(targetDate);

            const response = createSuccessResponse({
                message: 'Tariffs synchronized successfully',
                date: targetDate.toISOString(),
                timestamp: new Date().toISOString()
            }, 'Tariffs synchronized successfully');

            res.status(200).json(response);
        } catch (error) {
            logger.error('Failed to sync tariffs', {
                context: 'TariffsController.syncTariffs',
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'TariffsController.syncTariffs',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            const response = createServerErrorResponse('Internal server error while syncing tariffs');
            res.status(500).json(response);
        }
    }
} 