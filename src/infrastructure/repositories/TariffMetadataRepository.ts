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

    // Переопределяем create для использования маппера
    async create(data: Partial<TariffMetadata>): Promise<TariffMetadata> {
        try {
            // Создаем Entity из переданных данных
            const metadata = new TariffMetadata(
                data.id || 0,
                data.date || new Date(),
                data.dtTillMax || null,
                data.createdAt || new Date(),
                data.updatedAt || new Date()
            );

            // Маппим Entity в БД формат (snake_case)
            const dbData = TariffMetadataMapper.toDto(metadata);

            const [result] = await this.knex(this.tableName)
                .insert(dbData)
                .returning('*');

            // Маппим результат БД обратно в Entity
            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to create record');
        }
    }

    // Переопределяем update для использования маппера
    async update(id: number, data: Partial<TariffMetadata>): Promise<TariffMetadata | null> {
        try {
            // Получаем существующий метаданные
            const existing = await this.findById(id);
            if (!existing) return null;

            // Создаем обновленный Entity
            const updatedMetadata = new TariffMetadata(
                existing.id,
                data.date ?? existing.date,
                data.dtTillMax ?? existing.dtTillMax,
                existing.createdAt,
                new Date() // updatedAt
            );

            // Маппим Entity в БД формат (snake_case)
            const dbData = TariffMetadataMapper.toDto(updatedMetadata);
            delete dbData.id; // Не обновляем ID
            delete dbData.created_at; // Не обновляем created_at

            const [result] = await this.knex(this.tableName)
                .where('id', id)
                .update(dbData)
                .returning('*');

            // Маппим результат БД обратно в Entity
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

            // Маппим результат БД в Entity
            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to find metadata by date');
        }
    }

    // Переопределяем findById для использования маппера
    async findById(id: number): Promise<TariffMetadata | null> {
        try {
            const result = await this.knex(this.tableName)
                .select('*')
                .where('id', id)
                .first();

            if (!result) return null;

            // Маппим результат БД в Entity
            return TariffMetadataMapper.toEntity(result);
        } catch {
            throw new Error('Failed to find record by id');
        }
    }

    // Переопределяем findAll для использования маппера
    async findAll(): Promise<TariffMetadata[]> {
        try {
            const results = await this.knex(this.tableName).select('*');

            // Маппим результаты БД в Entity
            return results.map(dbRow => TariffMetadataMapper.toEntity(dbRow));
        } catch (error) {
            throw new Error('Failed to find all records');
        }
    }
}