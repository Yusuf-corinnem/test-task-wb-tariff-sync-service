import { TariffsRepository } from '../../infrastructure/repositories/TariffsRepository';
import { TariffMetadataRepository } from '../../infrastructure/repositories/TariffMetadataRepository';
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
            const targetDate = new Date(date);

            const tariffs = await this.tariffsRepository.findByDate(targetDate);
            const metadata = await this.tariffMetadataRepository.findByDate(targetDate);

            return {
                date: date,
                metadata: metadata ? {
                    id: metadata.id,
                    date: metadata.date?.toISOString() || null,
                    dt_till_max: metadata.dtTillMax?.toISOString() || null,
                    created_at: metadata.createdAt?.toISOString() || null,
                    updated_at: metadata.updatedAt?.toISOString() || null
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