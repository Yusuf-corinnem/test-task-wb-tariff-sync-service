import { TariffMetadataRepository } from '../../infrastructure/repositories/TariffMetadataRepository.js';
import { logger } from '../../shared/utils/logger.js';

export class GetAvailableDatesUseCase {
    constructor(
        private readonly tariffMetadataRepository: TariffMetadataRepository
    ) { }

    async execute(): Promise<{
        dates: string[];
        count: number;
        timestamp: string;
    }> {
        logger.info('Getting available dates', {
            context: 'GetAvailableDatesUseCase.execute'
        });

        try {
            const allMetadata = await this.tariffMetadataRepository.findAll();
            const dates = allMetadata.map(meta => meta.date);

            return {
                dates: dates.map(date => date.toISOString().split('T')[0]),
                count: dates.length,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('Failed to get available dates', {
                context: 'GetAvailableDatesUseCase.execute',
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'GetAvailableDatesUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            throw error;
        }
    }
} 