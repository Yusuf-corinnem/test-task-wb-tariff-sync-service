import knex, { migrate, seed } from "#postgres/knex.js";

console.log("Starting WB Tariff Sync Service...");

try {
    // Выполнить миграции
    console.log("Running migrations...");
    await migrate.latest();
    console.log("Migrations completed successfully");

    // Выполнить сиды
    console.log("Running seeds...");
    await seed.run();
    console.log("Seeds completed successfully");

    console.log("✅ Service is ready! All migrations and seeds have been run");
    console.log("📊 Database structure:");
    console.log("   - tariff_metadata table created");
    console.log("   - tariffs table created");
    console.log("   - spreadsheets table updated");
    console.log("🌱 Test data inserted:");
    console.log("   - 3 Google spreadsheets for different regions");
    console.log("   - 3 test tariffs for Central Federal District");

} catch (error) {
    console.error("❌ Error during startup:", error);
    process.exit(1);
}