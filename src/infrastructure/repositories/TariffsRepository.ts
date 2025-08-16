import { BaseRepository } from './BaseRepository';
import { Tariff } from '../../domain/entities/Tariff';
import { Knex } from 'knex';
import { ITariffsRepository } from '../../domain/interfaces/ITariffsRepository';

export class TariffsRepository extends BaseRepository<Tariff> implements ITariffsRepository {
    protected tableName = 'tariffs';

    constructor(knex: Knex) {
        super(knex);
    }

    async findByDate(date: Date): Promise<Tariff[]> {
        try {
            return await this.knex(this.tableName)
                .join('tariff_metadata', 'tariffs.tariff_metadata_id', 'tariff_metadata.id')
                .where('tariff_metadata.date', date)
                .select('tariffs.*')
                .orderBy('tariffs.warehouse_name', 'asc');
        } catch {
            throw new Error('Failed to find tariffs by date');
        }
    }

    async findByRegion(region: string): Promise<Tariff[]> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('region', region)
                .orderBy('date', 'asc');
        } catch {
            throw new Error('Failed to find tariffs by region');
        }
    }

    async findByMetadataId(metadataId: number): Promise<Tariff[]> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('tariff_metadata_id', metadataId)
                .orderBy('warehouse_name', 'asc');
        } catch {
            throw new Error('Failed to find tariffs by metadata id');
        }
    }
}