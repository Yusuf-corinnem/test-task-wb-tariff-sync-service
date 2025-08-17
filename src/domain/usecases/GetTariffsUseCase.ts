import { TariffsRepository } from '../../infrastructure/repositories/TariffsRepository';
import { TariffMetadataRepository } from '../../infrastructure/repositories/TariffMetadataRepository';
import { Validator } from '../../shared/utils/Validator';
import { logger } from '../../shared/utils/logger';

export class GetTariffsUseCase {
    constructor(
        private readonly tariffsRepository: TariffsRepository,
        private readonly tariffMetadataRepository: TariffMetadataRepository
    ) { }

    async execute(date: string): Promise<{
        date: string;
        metadata: any;
        tariffs: any[];
        count: number;
        timestamp: string;
    }> {
        logger.info('Getting tariffs by date', {
            context: 'GetTariffsUseCase.execute',
            metadata: { date }
        });

        try {
            // Валидация даты
            const targetDate = new Date(date);
            Validator.validateDate(targetDate);

            // Получение данных
            const tariffs = await this.tariffsRepository.findByDate(targetDate);
            const metadata = await this.tariffMetadataRepository.findByDate(targetDate);

            return {
                date: date,
                metadata: metadata ? {
                    id: metadata.id,
                    date: metadata.date?.toISOString() || null,
                    dtTillMax: metadata.dtTillMax?.toISOString() || null,
                    dtNextBox: metadata.dtNextBox?.toISOString() || null,
                    createdAt: metadata.createdAt?.toISOString() || null,
                    updatedAt: metadata.updatedAt?.toISOString() || null
                } : null,
                tariffs: tariffs,
                count: tariffs.length,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('Failed to get tariffs by date', {
                context: 'GetTariffsUseCase.execute',
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'GetTariffsUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            throw error;
        }
    }
} 