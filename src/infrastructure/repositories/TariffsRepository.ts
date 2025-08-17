import { BaseRepository } from './BaseRepository';
import { Tariff } from '../../domain/entities/Tariff';
import { Knex } from 'knex';
import { ITariffsRepository } from '../../domain/interfaces/repositories/ITariffsRepository';
import { TariffMapper } from '../../shared/mappers/TariffMapper.js';
import { logger } from '../../shared/utils/logger.js';

export class TariffsRepository extends BaseRepository<Tariff> implements ITariffsRepository {
    protected tableName = 'tariffs';

    constructor(knex: Knex) {
        super(knex);
    }

    async create(data: Partial<Tariff>): Promise<Tariff> {
        try {
            const tariff = new Tariff(
                data.id || 0,
                data.tariffMetadataId || 0,
                data.warehouseName || '',
                data.geoName || '',
                data.boxDeliveryAndStorageExpr || '',
                data.boxDeliveryCoefExpr || '',
                data.boxStorageCoefExpr || '',
                data.boxDeliveryBase || '',
                data.boxStorageBase || '',
                data.boxDeliveryLiter || '',
                data.boxStorageLiter || '',
                data.boxDeliveryMarketplaceBase || '',
                data.boxDeliveryMarketplaceCoefExpr || '',
                data.boxDeliveryMarketplaceLiter || '',
                data.createdAt || new Date(),
                data.updatedAt || new Date()
            );

            const dbData = TariffMapper.toDbRow(tariff);
            const insertData: any = { ...dbData };
            delete insertData.id;

            const [row] = await this.knex(this.tableName)
                .insert(insertData)
                .onConflict(['tariff_metadata_id', 'warehouse_name'])
                .merge(insertData)
                .returning('*');

            return TariffMapper.fromDbRow(row);
        } catch (error) {
            logger.error('Failed to create tariff', {
                context: 'TariffsRepository.create',
                errorInfo: { reason: (error as Error).message, stack: (error as Error).stack, location: 'TariffsRepository.create' }
            });
            throw new Error(`Failed to create record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async update(id: number, data: Partial<Tariff>): Promise<Tariff | null> {
        try {
            const existing = await this.findById(id);
            if (!existing) return null;

            const updatedTariff = new Tariff(
                existing.id,
                data.tariffMetadataId ?? existing.tariffMetadataId,
                data.warehouseName ?? existing.warehouseName,
                data.geoName ?? existing.geoName,
                data.boxDeliveryAndStorageExpr ?? existing.boxDeliveryAndStorageExpr,
                data.boxDeliveryCoefExpr ?? existing.boxDeliveryCoefExpr,
                data.boxStorageCoefExpr ?? existing.boxStorageCoefExpr,
                data.boxDeliveryBase ?? existing.boxDeliveryBase,
                data.boxStorageBase ?? existing.boxStorageBase,
                data.boxDeliveryLiter ?? existing.boxDeliveryLiter,
                data.boxStorageLiter ?? existing.boxStorageLiter,
                data.boxDeliveryMarketplaceBase ?? existing.boxDeliveryMarketplaceBase,
                data.boxDeliveryMarketplaceCoefExpr ?? existing.boxDeliveryMarketplaceCoefExpr,
                data.boxDeliveryMarketplaceLiter ?? existing.boxDeliveryMarketplaceLiter,
                existing.createdAt,
                new Date()
            );

            const dbData = TariffMapper.toDbRow(updatedTariff) as any;
            delete dbData.id;
            delete dbData.tariff_metadata_id;
            delete dbData.warehouse_name;

            const [row] = await this.knex(this.tableName)
                .where('id', id)
                .update(dbData)
                .returning('*');

            return TariffMapper.fromDbRow(row);
        } catch (error) {
            logger.error('Failed to update tariff', {
                context: 'TariffsRepository.update',
                metadata: { id },
                errorInfo: { reason: (error as Error).message, stack: (error as Error).stack, location: 'TariffsRepository.update' }
            });
            throw new Error(`Failed to update record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findByDate(date: Date): Promise<Tariff[]> {
        try {
            const rows = await this.knex(this.tableName)
                .join('tariff_metadata', 'tariffs.tariff_metadata_id', 'tariff_metadata.id')
                .where('tariff_metadata.date', date)
                .select('tariffs.*')
                .orderBy('tariffs.warehouse_name', 'asc');

            return rows.map(TariffMapper.fromDbRow);
        } catch {
            throw new Error('Failed to find tariffs by date');
        }
    }

    async findByRegion(region: string): Promise<Tariff[]> {
        try {
            const results = await this.knex(this.tableName)
                .select('*')
                .where('region', region)
                .orderBy('date', 'asc');

            return results.map(TariffMapper.fromDbRow);
        } catch {
            throw new Error('Failed to find tariffs by region');
        }
    }

    async findByMetadataId(metadataId: number): Promise<Tariff[]> {
        try {
            const results = await this.knex(this.tableName)
                .select('*')
                .where('tariff_metadata_id', metadataId)
                .orderBy('warehouse_name', 'asc');

            return results.map(TariffMapper.fromDbRow);
        } catch {
            throw new Error('Failed to find tariffs by metadata id');
        }
    }

    async findById(id: number): Promise<Tariff | null> {
        try {
            const result = await this.knex(this.tableName)
                .select('*')
                .where('id', id)
                .first();

            if (!result) return null;

            return TariffMapper.fromDbRow(result);
        } catch {
            throw new Error('Failed to find record by id');
        }
    }

    async findAll(): Promise<Tariff[]> {
        try {
            const results = await this.knex(this.tableName).select('*');
            return results.map(TariffMapper.fromDbRow);
        } catch (error) {
            throw new Error('Failed to find all records');
        }
    }
}