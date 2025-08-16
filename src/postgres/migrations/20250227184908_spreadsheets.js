/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    // Сначала удаляем таблицу, если она существует (для пересоздания)
    await knex.schema.dropTableIfExists("spreadsheets");

    return knex.schema.createTable("spreadsheets", (table) => {
        table.increments("id").primary();
        table.string("spreadsheet_id", 255).unique().notNullable();
        table.string("region_filter", 255);
        table.string("description", 500);
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("spreadsheets");
}
