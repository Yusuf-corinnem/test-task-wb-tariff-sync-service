/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    // Сначала удаляем таблицу, если она существует (для пересоздания)
    await knex.schema.dropTableIfExists("tariff_metadata");

    return knex.schema.createTable("tariff_metadata", (table) => {
        table.increments("id").primary();
        table.date("date").notNullable();
        table.date("dt_till_max").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariff_metadata");
} 