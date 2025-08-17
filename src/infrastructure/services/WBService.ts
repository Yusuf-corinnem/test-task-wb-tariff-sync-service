import axios from "axios";

import { TariffDto } from "../../http/dto/TariffDto.js";
import { IWBService } from "../../domain/interfaces/services/IWBService";
import { wbConfig } from "../../config/services/wb.config";
import { IWBResponse } from "../../shared/types/wb";
import { logger } from "../../shared/utils/logger.js";

export class WBService implements IWBService {
    async getTariffs(date: Date): Promise<IWBResponse> {
        const formattedDate = date.toISOString().split('T')[0];

        logger.info('Requesting WB tariffs', {
            context: 'WBService.getTariffs',
            metadata: { formattedDate }
        });

        const response = await axios.get(
            `${wbConfig.baseUrl}/tariffs/box?date=${formattedDate}`,
            { headers: { 'Authorization': wbConfig.apiKey || '' } }
        );

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
    }
}