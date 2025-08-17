import { BaseRepository } from './BaseRepository';
import { Spreadsheet } from '../../domain/entities/Spreadsheet';
import { Knex } from 'knex';
import { ISpreadsheetsRepository } from '../../domain/interfaces/repositories/ISpreadsheetsRepository';

export class SpreadsheetsRepository extends BaseRepository<Spreadsheet> implements ISpreadsheetsRepository {
    protected tableName = 'spreadsheets';

    constructor(knex: Knex) {
        super(knex);
    }

    async findActive(): Promise<Spreadsheet[]> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('is_active', true)
                .orderBy('created_at', 'desc');
        } catch {
            throw new Error('Failed to find active spreadsheets');
        }
    }

    async findByRegion(region: string): Promise<Spreadsheet[]> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('region_filter', region)
                .where('is_active', true)
                .orderBy('created_at', 'desc');
        } catch {
            throw new Error('Failed to find spreadsheets by region');
        }
    }
}