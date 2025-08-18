import { BaseRepository } from './BaseRepository';
import { TariffMetadata } from '../../domain/entities/TariffMetadata';
import { Knex } from 'knex';
import { ITariffMetadataRepository } from '../../domain/interfaces/repositories/ITariffMetadataRepository';
import { TariffMetadataMapper } from '../../shared/mappers/TariffMetadataMapper.js';

export class TariffMetadataRepository extends BaseRepository<TariffMetadata> implements ITariffMetadataRepository {
    protected tableName = 'tariff_metadata';

    constructor(knex: Knex) {
        super(knex);
    }

    async create(data: Partial<TariffMetadata>): Promise<TariffMetadata> {
        try {
            const metadata = new TariffMetadata(
                data.id || 0,
                data.date || new Date(),
                data.dtTillMax || null,
                data.dtNextBox || null,
                data.createdAt || new Date(),
                data.updatedAt || new Date()
            );

            const dbData = TariffMetadataMapper.toDto(metadata);
            const insertData: any = { ...dbData };
            delete insertData.id;

            const [result] = await this.knex(this.tableName)
                .insert(insertData)
                .onConflict(['date'])
                .merge(insertData)
                .returning('*');

            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to create record');
        }
    }

    async update(id: number, data: Partial<TariffMetadata>): Promise<TariffMetadata | null> {
        try {
            const existing = await this.findById(id);
            if (!existing) return null;

            const updatedMetadata = new TariffMetadata(
                existing.id,
                data.date ?? existing.date,
                data.dtTillMax ?? existing.dtTillMax,
                data.dtNextBox ?? existing.dtNextBox,
                existing.createdAt,
                new Date()
            );

            const dbData = TariffMetadataMapper.toDto(updatedMetadata);
            delete dbData.id;
            delete dbData.created_at;

            const [result] = await this.knex(this.tableName)
                .where('id', id)
                .update(dbData)
                .returning('*');

            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to update record');
        }
    }

    async findByDate(date: Date): Promise<TariffMetadata | null> {
        try {
            const result = await this.knex(this.tableName)
                .select('*')
                .where('date', date)
                .first();

            if (!result) return null;

            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to find metadata by date');
        }
    }

    async findById(id: number): Promise<TariffMetadata | null> {
        try {
            const result = await this.knex(this.tableName)
                .select('*')
                .where('id', id)
                .first();

            if (!result) return null;

            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to find record by id');
        }
    }

    async findAll(): Promise<TariffMetadata[]> {
        try {
            const results = await this.knex(this.tableName).select('*');
            return results.map(dbRow => TariffMetadataMapper.toEntity(dbRow));
        } catch (error) {
            throw new Error('Failed to find all records');
        }
    }
}