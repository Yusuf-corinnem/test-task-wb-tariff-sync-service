/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    // Сначала удаляем таблицу, если она существует (для пересоздания)
    await knex.schema.dropTableIfExists("tariffs");

    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.integer("tariff_metadata_id").notNullable().references("id").inTable("tariff_metadata");
        table.string("warehouse_name", 255).notNullable();
        table.string("geo_name", 255).notNullable();
        table.integer("box_delivery_and_storage_coefficient");
        table.integer("box_delivery_coefficient");
        table.integer("box_storage_coefficient");
        table.decimal("box_delivery_base", 10, 2);
        table.decimal("box_storage_base", 10, 2);
        table.decimal("box_delivery_liter", 10, 2);
        table.decimal("box_storage_liter", 10, 2);
        table.decimal("box_delivery_marketplace_base", 10, 2);
        table.integer("box_delivery_marketplace_coefficient");
        table.decimal("box_delivery_marketplace_liter", 10, 2);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.unique(["tariff_metadata_id", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
} 