/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([
            {
                spreadsheet_id: "1UqWbOzIjaJ-KeC_hqgJIeA3u7Bsalmjmd8bbRGke5U4",
                region_filter: "Центральный федеральный округ",
                description: "Тестовая таблица для Центрального округа",
                is_active: true
            },
            {
                spreadsheet_id: "1g42FRoVi9Zi3SaQrhNtqHQAlNJMajYTu7wDVArQJuq4",
                region_filter: "Северо-Западный федеральный округ",
                description: "Тестовая таблица для СЗФО",
                is_active: true
            },
            {
                spreadsheet_id: "1vXPxlYFLsHdgAJHPjWx1Cl7or3kYqGJzdfu1-Y3pIJU",
                region_filter: "Южный федеральный округ",
                description: "Тестовая таблица для ЮФО",
                is_active: true
            }
        ])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
