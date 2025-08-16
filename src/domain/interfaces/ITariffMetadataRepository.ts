import { IBaseRepository } from './IBaseRepository';
import { TariffMetadata } from '../entities/TariffMetadata';

export interface ITariffMetadataRepository extends IBaseRepository<TariffMetadata> {
    findByDate(date: Date): Promise<TariffMetadata | null>;
}