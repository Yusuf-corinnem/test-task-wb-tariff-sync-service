import { TariffDto } from "../../http/dto/TariffDto";

export interface IWBResponse {
    tariffs: TariffDto[];
    metadata: {
        dt_next_box: Date | null;
        dt_till_max: Date;
    };
}