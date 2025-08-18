import axios, { AxiosInstance } from "axios";

import { TariffDto } from "../../http/dto/TariffDto.js";
import { IWBService } from "../../domain/interfaces/services/IWBService";
import { wbConfig } from "../../config/services/wb.config";
import { IWBResponse } from "../../shared/types/wb";
import { logger } from "../../shared/utils/logger.js";

export class WBService implements IWBService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: wbConfig.baseUrl,
            timeout: wbConfig.timeout,
            headers: { 'Authorization': wbConfig.apiKey || '' }
        });
    }
    async getTariffs(date: Date): Promise<IWBResponse> {
        const formattedDate = date.toISOString().split('T')[0];

        logger.info('Requesting WB tariffs', {
            context: 'WBService.getTariffs',
            metadata: { formattedDate }
        });

        const url = `/tariffs/box?date=${formattedDate}`;

        let attempt = 0;
        let lastError: any = null;
        while (attempt < (wbConfig.retryAttempts || 1)) {
            try {
                const response = await this.client.get(url);
                const rawTariffs = response.data.response.data.warehouseList;
                const tariffs: TariffDto[] = rawTariffs.map((rawTariff: any) => ({
                    ...rawTariff,
                    id: undefined,
                    tariff_metadata_id: 0
                }));

                return {
                    tariffs,
                    metadata: {
                        dt_next_box: response.data.response.data.dtNextBox && response.data.response.data.dtNextBox !== '' ? new Date(response.data.response.data.dtNextBox) : null,
                        dt_till_max: response.data.response.data.dtTillMax && response.data.response.data.dtTillMax !== '' ? new Date(response.data.response.data.dtTillMax) : new Date()
                    }
                };
            } catch (error: any) {
                lastError = error;
                const status = error?.response?.status;
                const retriable = !status || status >= 500 || status === 429;
                attempt++;

                logger.warn('WB request failed, will retry if allowed', {
                    context: 'WBService.getTariffs',
                    metadata: { attempt, retryAttempts: wbConfig.retryAttempts, status },
                });

                if (!retriable || attempt >= (wbConfig.retryAttempts || 1)) break;
                
                // 5 секундная задержка
                await new Promise(res => setTimeout(res, 5000));
            }
        }
        throw lastError;
    }
}