import { Command } from "commander";
import { migrate, seed } from "../../infrastructure/database/knex";
const program = new Command();

program
    .command("migrate")
    .argument("[type]", "latest|rollback|status")
    .action(async (action: string) => {
        if (!action) return;
        if (action === "latest") await migrate.latest();
        if (action === "rollback") await migrate.rollback();
        if (action === "status") await migrate.status();
        process.exit(0);
    });
program.command("seed [action]").action(async (action: string) => {
    if (!action) return;
    if (action === "run") await seed.run();
    process.exit(0);
});
program.command("default", { isDefault: true }).action(() => { });
program.parse();
