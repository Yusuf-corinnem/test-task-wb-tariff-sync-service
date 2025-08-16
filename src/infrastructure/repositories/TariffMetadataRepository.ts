import { BaseRepository } from './BaseRepository';
import { TariffMetadata } from '../../domain/entities/TariffMetadata';
import { Knex } from 'knex';
import { ITariffMetadataRepository } from '../../domain/interfaces/ITariffMetadataRepository';

export class TariffMetadataRepository extends BaseRepository<TariffMetadata> implements ITariffMetadataRepository {
    protected tableName = 'tariff_metadata';

    constructor(knex: Knex) {
        super(knex);
    }

    async findByDate(date: Date): Promise<TariffMetadata | null> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('date', date)
                .first();
        } catch {
            throw new Error('Failed to find metadata by date');
        }
    }
}