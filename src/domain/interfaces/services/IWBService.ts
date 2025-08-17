import { IWBResponse } from '../../../shared/types/wb';

export interface IWBService {
    getTariffs(date: Date): Promise<IWBResponse>;
}
