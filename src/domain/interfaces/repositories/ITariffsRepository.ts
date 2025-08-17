import { IBaseRepository } from './IBaseRepository';
import { Tariff } from '../../entities/Tariff';

export interface ITariffsRepository extends IBaseRepository<Tariff> {
    findByDate(date: Date): Promise<Tariff[]>;
    findByRegion(region: string): Promise<Tariff[]>;
    findByMetadataId(metadataId: number): Promise<Tariff[]>;
}