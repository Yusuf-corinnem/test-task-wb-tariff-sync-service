import { TariffDto } from "../../http/dto/TariffDto";

export interface IWBResponse {
    tariffs: TariffDto[];
    metadata: {
        dtNextBox: Date;
        dtTillMax: Date;
    };
}