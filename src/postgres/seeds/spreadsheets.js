/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([
            {
                spreadsheet_id: "test_table_central",
                region_filter: "Центральный федеральный округ",
                description: "Тестовая таблица для Центрального округа"
            },
            {
                spreadsheet_id: "test_table_northwest",
                region_filter: "Северо-Западный федеральный округ",
                description: "Тестовая таблица для СЗФО"
            },
            {
                spreadsheet_id: "test_table_south",
                region_filter: "Южный федеральный округ",
                description: "Тестовая таблица для ЮФО"
            }
        ])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
