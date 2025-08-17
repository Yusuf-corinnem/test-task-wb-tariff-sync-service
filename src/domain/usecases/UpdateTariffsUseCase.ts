import { TariffMetadataRepository } from "../../infrastructure/repositories/TariffMetadataRepository";
import { FetchTariffsUseCase } from "./FetchTariffsUseCase";
import { CreateTariffsUseCase } from "./CreateTariffsUseCase";
import { UpdateExistingTariffsUseCase } from "./UpdateExistingTariffsUseCase";
import { TariffMetadataMapper } from "../../shared/mappers/TariffMetadataMapper";
import { logger } from "../../shared/utils/logger";

export class UpdateTariffsUseCase {
    constructor(
        private readonly tariffMetadataRepository: TariffMetadataRepository,
        private readonly fetchTariffsUseCase: FetchTariffsUseCase,
        private readonly createTariffsUseCase: CreateTariffsUseCase,
        private readonly updateExistingTariffsUseCase: UpdateExistingTariffsUseCase
    ) { }

    async execute(date: Date): Promise<void> {
        logger.info('Starting tariffs update process', {
            context: 'UpdateTariffsUseCase.execute',
            date: date.toISOString()
        });

        try {
            const tariffs = await this.fetchTariffsUseCase.execute(date);

            const metadata = await this.tariffMetadataRepository.findByDate(date);

            if (!metadata) {
                logger.info('Creating new tariffs metadata and tariffs', {
                    context: 'UpdateTariffsUseCase.execute',
                    date: date.toISOString()
                });

                const newMetadata = {
                    date: date.toISOString(),
                    dt_till_max: tariffs.metadata.dt_till_max?.toISOString(),
                    dt_next_box: tariffs.metadata.dt_next_box?.toISOString()
                };

                await this.createTariffsUseCase.execute(newMetadata, tariffs.tariffs);
            } else {
                logger.info('Updating existing tariffs', {
                    context: 'UpdateTariffsUseCase.execute',
                    date: date.toISOString()
                });

                await this.updateExistingTariffsUseCase.execute(TariffMetadataMapper.toDto(metadata), tariffs.tariffs);
            }

            logger.info('Tariffs update process completed successfully', {
                context: 'UpdateTariffsUseCase.execute',
                date: date.toISOString()
            });

        } catch (error) {
            logger.error('Failed to update tariffs', {
                context: 'UpdateTariffsUseCase.execute',
                date: date.toISOString(),
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'UpdateTariffsUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined,
                    details: { originalError: error }
                }
            });

            throw error;
        }
    }
}