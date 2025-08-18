import { Request, Response } from 'express';
import { SpreadsheetsRepository } from '../../infrastructure/repositories/SpreadsheetsRepository.js';
import { createSuccessResponse, createValidationErrorResponse, createServerErrorResponse } from '../../shared/utils/apiResponse.js';
import { logger } from '../../shared/utils/logger.js';

export class SpreadsheetsController {
	constructor(private readonly spreadsheetsRepository: SpreadsheetsRepository) {}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const { spreadsheetId, regionFilter, description, isActive } = req.body || {};

			if (!spreadsheetId || typeof spreadsheetId !== 'string') {
				res.status(400).json(createValidationErrorResponse('spreadsheetId is required'));
				return;
			}

			const data = {
				spreadsheet_id: spreadsheetId,
				region_filter: regionFilter ?? null,
				description: description ?? null,
				is_active: isActive ?? true,
			};

			const created = await this.spreadsheetsRepository.create(data as any);
			res.status(201).json(createSuccessResponse(created, 'Spreadsheet added'));
		} catch (error) {
			logger.error('Failed to create spreadsheet', {
				context: 'SpreadsheetsController.create',
				errorInfo: {
					reason: error instanceof Error ? error.message : 'Unknown error',
					location: 'SpreadsheetsController.create',
					stack: error instanceof Error ? error.stack : undefined,
				},
			});
			res.status(500).json(createServerErrorResponse());
		}
	}

	async findAll(req: Request, res: Response): Promise<void> {
		try {
			const items = await this.spreadsheetsRepository.findAll();
			res.status(200).json(createSuccessResponse(items, 'Spreadsheets list'));
		} catch (error) {
			logger.error('Failed to list spreadsheets', {
				context: 'SpreadsheetsController.list',
				errorInfo: { reason: (error as Error).message, location: 'SpreadsheetsController.list' }
			});
			res.status(500).json(createServerErrorResponse());
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params as any;
			const { spreadsheetId, regionFilter, description, isActive } = req.body || {};
			const data: any = {};
			if (spreadsheetId !== undefined) data.spreadsheet_id = spreadsheetId;
			if (regionFilter !== undefined) data.region_filter = regionFilter;
			if (description !== undefined) data.description = description;
			if (isActive !== undefined) data.is_active = isActive;

			const updated = await this.spreadsheetsRepository.update(Number(id), data);
			if (!updated) {
				res.status(404).json(createValidationErrorResponse('Spreadsheet not found'));
				return;
			}
			res.status(200).json(createSuccessResponse(updated, 'Spreadsheet updated'));
		} catch (error) {
			logger.error('Failed to update spreadsheet', {
				context: 'SpreadsheetsController.update',
				errorInfo: { reason: (error as Error).message, location: 'SpreadsheetsController.update' }
			});
			res.status(500).json(createServerErrorResponse());
		}
	}
}


