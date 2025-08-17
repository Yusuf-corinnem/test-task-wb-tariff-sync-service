import { TariffMetadataDto } from "../../http/dto/TariffMetadataDto.js";
import { TariffDto } from "../../http/dto/TariffDto.js";
import { TariffMetadataRepository } from "../../infrastructure/repositories/TariffMetadataRepository.js";
import { TariffsRepository } from "../../infrastructure/repositories/TariffsRepository";
import { Validator } from "../../shared/utils/Validator.js";
import { logger } from "../../shared/utils/logger.js";

export class CreateTariffsUseCase {
    constructor(
        private readonly tariffRepository: TariffsRepository,
        private readonly tariffMetadataRepository: TariffMetadataRepository
    ) { }

    async execute(metadata: TariffMetadataDto, tariffs: TariffDto[]): Promise<void> {
        logger.info('Starting creation of new tariffs', {
            context: 'CreateTariffsUseCase.execute',
            date: metadata.date,
            metadata: { tariffsCount: tariffs.length }
        });

        try {
            Validator.validateDate(new Date(metadata.date));
            Validator.validateDate(new Date(metadata.dtTillMax || ""));
            Validator.validateDate(new Date(metadata.dtNextBox || ""));

            const newMetadata = await this.tariffMetadataRepository.create({
                date: new Date(metadata.date),
                dtTillMax: new Date(metadata.dtTillMax || ""),
                dtNextBox: new Date(metadata.dtNextBox || ""),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            for (const tariff of tariffs) {
                await this.tariffRepository.create({
                    ...tariff,
                    tariffMetadataId: newMetadata.id
                });
            }

            logger.info('Successfully created new tariffs', {
                context: 'CreateTariffsUseCase.execute',
                date: metadata.date,
                metadata: {
                    tariffsCount: tariffs.length,
                    metadataId: newMetadata.id
                }
            });

        } catch (error) {
            logger.error('Failed to create tariffs', {
                context: 'CreateTariffsUseCase.execute',
                date: metadata.date,
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'CreateTariffsUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            throw error;
        }
    }
} 