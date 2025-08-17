/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    const today = new Date().toISOString().split('T')[0];

    const [metadata] = await knex("tariff_metadata")
        .insert({ date: today, dt_till_max: "2025-09-01" })
        .onConflict(["date"]).merge()
        .returning(["id"]);

    await knex("tariffs")
        .insert([
            {
                tariff_metadata_id: metadata.id,
                warehouse_name: "Коледино",
                geo_name: "Центральный федеральный округ",
                box_delivery_and_storage_coefficient: 195,
                box_delivery_coefficient: 195,
                box_storage_coefficient: 145,
                box_delivery_base: 74.10,
                box_storage_base: 0.10,
                box_delivery_liter: 18.53,
                box_storage_liter: 0.10,
                box_delivery_marketplace_base: 74.10,
                box_delivery_marketplace_coefficient: 195,
                box_delivery_marketplace_liter: 18.53
            },
            {
                tariff_metadata_id: metadata.id,
                warehouse_name: "Подольск",
                geo_name: "Центральный федеральный округ",
                box_delivery_and_storage_coefficient: 200,
                box_delivery_coefficient: 200,
                box_storage_coefficient: 170,
                box_delivery_base: 76.00,
                box_storage_base: 0.12,
                box_delivery_liter: 19.00,
                box_storage_liter: 0.12,
                box_delivery_marketplace_base: 74.10,
                box_delivery_marketplace_coefficient: 195,
                box_delivery_marketplace_liter: 18.53
            },
            {
                tariff_metadata_id: metadata.id,
                warehouse_name: "Электросталь",
                geo_name: "Центральный федеральный округ",
                box_delivery_and_storage_coefficient: 160,
                box_delivery_coefficient: 160,
                box_storage_coefficient: 115,
                box_delivery_base: 60.80,
                box_storage_base: 0.08,
                box_delivery_liter: 15.20,
                box_storage_liter: 0.08,
                box_delivery_marketplace_base: 60.80,
                box_delivery_marketplace_coefficient: 160,
                box_delivery_marketplace_liter: 15.20
            }
        ])
        .onConflict(["tariff_metadata_id", "warehouse_name"]).merge();
}
