import { TariffMetadataDto } from "../../http/dto/TariffMetadataDto";
import { TariffDto } from "../../http/dto/TariffDto";
import { TariffsRepository } from "../../infrastructure/repositories/TariffsRepository";
import { Validator } from "../../shared/utils/Validator";
import { logger } from "../../shared/utils/logger";
import { TariffMapper } from "../../shared/mappers/TariffMapper.js";
import { isEqual } from "lodash";

export class UpdateExistingTariffsUseCase {
    constructor(
        private readonly tariffRepository: TariffsRepository
    ) { }

    async execute(metadata: TariffMetadataDto, tariffs: TariffDto[]): Promise<void> {
        logger.info('Starting update of existing tariffs', {
            context: 'UpdateExistingTariffsUseCase.execute',
            date: metadata.date,
            metadata: { tariffsCount: tariffs.length }
        });

        try {
            Validator.validateDate(new Date(metadata.date));

            const existingTariffs = await this.tariffRepository.findByDate(new Date(metadata.date));

            let createdCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;

            for (const tariffDto of tariffs) {
                const nextEntity = TariffMapper.toEntity({
                    ...tariffDto,
                    tariffMetadataId: metadata.id!
                });

                const existingTariff = existingTariffs.find((t) =>
                    t.warehouseName === nextEntity.warehouseName &&
                    t.geoName === nextEntity.geoName
                );

                if (!existingTariff) {
                    logger.info('Creating new tariff', {
                        context: 'UpdateExistingTariffsUseCase.execute',
                        metadata: { warehouseName: nextEntity.warehouseName, geoName: nextEntity.geoName }
                    });

                    await this.tariffRepository.create(nextEntity);
                    createdCount++;
                    continue;
                }

                const currentDb = TariffMapper.toDbRow(existingTariff) as any;
                const nextDb = TariffMapper.toDbRow(nextEntity) as any;
                delete currentDb.id; delete currentDb.tariff_metadata_id; delete currentDb.warehouse_name;
                delete nextDb.id; delete nextDb.tariff_metadata_id; delete nextDb.warehouse_name;

                if (isEqual(currentDb, nextDb)) {
                    skippedCount++;
                    continue;
                }

                logger.info('Updating existing tariff', {
                    context: 'UpdateExistingTariffsUseCase.execute',
                    metadata: { id: existingTariff.id }
                });
                await this.tariffRepository.update(existingTariff.id, nextEntity);
                updatedCount++;
            }

            logger.info('Successfully updated existing tariffs', {
                context: 'UpdateExistingTariffsUseCase.execute',
                date: metadata.date,
                metadata: {
                    createdCount,
                    updatedCount,
                    skippedCount,
                    totalProcessed: tariffs.length
                }
            });

        } catch (error) {
            logger.error('Failed to update existing tariffs', {
                context: 'UpdateExistingTariffsUseCase.execute',
                date: metadata.date,
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'UpdateExistingTariffsUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            throw error;
        }
    }
} 