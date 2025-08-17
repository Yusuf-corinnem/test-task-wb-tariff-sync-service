import { IWBService } from "../../domain/interfaces/services/IWBService";
import { Validator } from "../../shared/utils/Validator";
import { logger } from "../../shared/utils/logger";
import { IWBResponse } from "../../shared/types/wb";

export class FetchTariffsUseCase {
    constructor(
        private wbService: IWBService
    ) { }

    async execute(date: Date): Promise<IWBResponse> {
        logger.info('Fetching tariffs from WB API', {
            context: 'FetchTariffsUseCase.execute',
            date: date.toISOString()
        });

        try {
            Validator.validateDate(date);

            return await this.wbService.getTariffs(date);
        } catch (error) {
            logger.error('Failed to fetch tariffs from WB API', {
                context: 'FetchTariffsUseCase.execute',
                date: date.toISOString(),
                errorInfo: {
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    location: 'FetchTariffsUseCase.execute',
                    stack: error instanceof Error ? error.stack : undefined,
                    details: { originalError: error }
                }
            });

            throw error;
        }
    }
}