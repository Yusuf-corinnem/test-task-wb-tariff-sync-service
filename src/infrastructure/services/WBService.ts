import axios from "axios";

import { TariffDto } from "../../http/dto/TariffDto.js";
import { IWBService } from "../../domain/interfaces/services/IWBService";
import { wbConfig } from "../../config/services/wb.config";
import { IWBResponse } from "../../shared/types/wb";

export class WBService implements IWBService {
    constructor() {
        console.log('WBService constructor - wbConfig:', {
            apiKey: wbConfig.apiKey,
            baseUrl: wbConfig.baseUrl,
            hasApiKey: !!wbConfig.apiKey,
            apiKeyLength: wbConfig.apiKey?.length || 0
        });
    }

    async getTariffs(date: Date): Promise<IWBResponse> {
        // Форматируем дату в YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];

        console.log('WBService.getTariffs called with config:', {
            apiKey: wbConfig.apiKey ? `${wbConfig.apiKey.substring(0, 10)}...` : 'empty',
            baseUrl: wbConfig.baseUrl,
            originalDate: date.toISOString(),
            formattedDate: formattedDate
        });

        const response = await axios.get(
            `${wbConfig.baseUrl}/tariffs/box?date=${formattedDate}`,
            {
                headers: {
                    'Authorization': wbConfig.apiKey || ''
                }
            }
        );

        return {
            tariffs: response.data.response.data.warehouseList,
            metadata: {
                dtNextBox: response.data.response.data.dtNextBox,
                dtTillMax: response.data.response.data.dtTillMax
            }
        };
    }
}