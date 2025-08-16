import { IBaseRepository } from './IBaseRepository';
import { Spreadsheet } from '../entities/Spreadsheet';

export interface ISpreadsheetsRepository extends IBaseRepository<Spreadsheet> {
    findActive(): Promise<Spreadsheet[]>;
    findByRegion(region: string): Promise<Spreadsheet[]>;
}