import { TariffMetadataDto } from "../../http/dto/TariffMetadataDto";
import { TariffDto } from "../../http/dto/TariffDto";
import { TariffsRepository } from "../../infrastructure/repositories/TariffsRepository";
import { Validator } from "../../shared/utils/Validator";
import { logger } from "../../shared/utils/logger";
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

            // Валидируем только если поля существуют
            if (metadata.dtTillMax) {
                Validator.validateDate(new Date(metadata.dtTillMax));
            }
            if (metadata.dtNextBox) {
                Validator.validateDate(new Date(metadata.dtNextBox));
            }

            const existingTariffs = await this.tariffRepository.findByDate(new Date(metadata.date));

            let createdCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;

            for (const tariff of tariffs) {
                const existingTariff = existingTariffs.find(t =>
                    t.warehouseName === tariff.warehouseName &&
                    t.geoName === tariff.geoName
                );

                if (!existingTariff) {
                    await this.tariffRepository.create({
                        ...tariff,
                        tariffMetadataId: metadata.id
                    });
                    createdCount++;
                } else {
                    if (!isEqual(tariff, existingTariff)) {
                        await this.tariffRepository.update(existingTariff.id, tariff);
                        updatedCount++;
                    } else {
                        skippedCount++;
                    }
                }
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