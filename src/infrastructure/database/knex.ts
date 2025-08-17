import knex from 'knex';
import knexfile from '../../config/knex/knexfile';

export const db = knex(knexfile);

export default db;

// CLI команды для миграций и сидов
export const migrate = {
    latest: async () => {
        try {
            console.log('Running migrations...');
            const [batchNo, log] = await db.migrate.latest();
            console.log(`Migrations completed. Batch: ${batchNo}`);
            if (log.length > 0) {
                console.log('Applied migrations:', log);
            }
            return { batchNo, log };
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    },

    rollback: async () => {
        try {
            console.log('Rolling back migrations...');
            const [batchNo, log] = await db.migrate.rollback();
            console.log(`Rollback completed. Batch: ${batchNo}`);
            if (log.length > 0) {
                console.log('Rolled back migrations:', log);
            }
            return { batchNo, log };
        } catch (error) {
            console.error('Rollback failed:', error);
            throw error;
        }
    },

    status: async () => {
        try {
            const status = await db.migrate.status();
            console.log('Migration status:', status);
            return status;
        } catch (error) {
            console.error('Status check failed:', error);
            throw error;
        }
    }
};

export const seed = {
    run: async () => {
        try {
            console.log('Running seeds...');
            const results = await db.seed.run();
            console.log('Seeds completed successfully');
            if (results && results.length > 0) {
                console.log('Seed results:', results);
            }
            return results;
        } catch (error) {
            console.error('Seeding failed:', error);
            throw error;
        }
    }
};
