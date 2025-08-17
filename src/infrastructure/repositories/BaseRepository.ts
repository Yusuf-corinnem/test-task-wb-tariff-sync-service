import { Knex } from "knex";
import { IBaseRepository } from "../../domain/interfaces/repositories/IBaseRepository";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected abstract tableName: string;

    constructor(protected knex: Knex) { }

    /**
     * Найти все записи
     */
    async findAll(): Promise<T[]> {
        try {
            return await this.knex(this.tableName).select('*');
        } catch (error) {
            throw new Error('Failed to find all records');
        }
    }

    /**
     * Найти запись по ID
     */
    async findById(id: number): Promise<T | null> {
        try {
            return await this.knex(this.tableName)
                .select('*')
                .where('id', id)
                .first() as T | null;
        } catch {
            throw new Error('Failed to find record by id');
        }
    }

    /**
     * Создать новую запись
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            const [result] = await this.knex(this.tableName)
                .insert(data)
                .returning('*');

            return result as T;
        } catch {
            throw new Error('Failed to create record');
        }
    }

    /**
     * Обновить существующую запись
     */
    async update(id: number, data: Partial<T>): Promise<T | null> {
        try {
            const [result] = await this.knex(this.tableName)
                .where('id', id)
                .update(data)
                .returning('*');

            return result as T | null;
        } catch {
            throw new Error('Failed to update record');
        }
    }

    /**
     * Удалить запись
     */
    async delete(id: number): Promise<boolean> {
        try {
            const result = await this.knex(this.tableName)
                .where('id', id)
                .delete();

            return result > 0;
        } catch {
            throw new Error('Failed to delete record');
        }
    }


    /**
     * Проверить существование записи
     */
    async exists(id: number): Promise<boolean> {
        try {
            const result = await this.knex(this.tableName)
                .where('id', id)
                .first();

            return result !== undefined;
        } catch {
            throw new Error('Failed to check record existence');
        }
    }
}