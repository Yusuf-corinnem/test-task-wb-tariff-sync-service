import express from 'express';
import cors from 'cors';
import { db as knex } from './infrastructure/database/knex.js';
import { TariffsRepository } from './infrastructure/repositories/TariffsRepository.js';
import { TariffMetadataRepository } from './infrastructure/repositories/TariffMetadataRepository.js';
import { SpreadsheetsRepository } from './infrastructure/repositories/SpreadsheetsRepository.js';
import { WBService } from './infrastructure/services/WBService.js';
import { FetchTariffsUseCase } from './domain/usecases/FetchTariffsUseCase.js';
import { CreateTariffsUseCase } from './domain/usecases/CreateTariffsUseCase.js';
import { UpdateExistingTariffsUseCase } from './domain/usecases/UpdateExistingTariffsUseCase.js';
import { UpdateTariffsUseCase } from './domain/usecases/UpdateTariffsUseCase.js';
import { GetTariffsUseCase } from './domain/usecases/GetTariffsUseCase.js';
import { GetAvailableDatesUseCase } from './domain/usecases/GetAvailableDatesUseCase.js';
import { TariffsController } from './http/controllers/TariffsController.js';
import { HealthController } from './http/controllers/HealthController.js';
import { createAppRouter } from './http/routes/index.js';
import { logger } from './shared/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        context: 'HTTP',
        metadata: {
            userAgent: req.get('User-Agent'),
            ip: req.ip
        }
    });
    next();
});

async function startApp() {
    try {
        console.log('🚀 Starting WB Tariff Sync Service...');

        // Выполняем миграции
        console.log('📊 Running database migrations...');
        await knex.migrate.latest();
        console.log('✅ Migrations completed');

        // Выполняем сиды
        console.log('🌱 Running database seeds...');
        await knex.seed.run();
        console.log('✅ Seeds completed');

        // Создаем экземпляры репозиториев
        const tariffsRepository = new TariffsRepository(knex);
        const tariffMetadataRepository = new TariffMetadataRepository(knex);
        const spreadsheetsRepository = new SpreadsheetsRepository(knex);

        // Создаем экземпляры сервисов
        const wbService = new WBService();

        // Создаем экземпляры use cases
        const fetchTariffsUseCase = new FetchTariffsUseCase(wbService);
        const createTariffsUseCase = new CreateTariffsUseCase(tariffsRepository, tariffMetadataRepository);
        const updateExistingTariffsUseCase = new UpdateExistingTariffsUseCase(tariffsRepository);
        const updateTariffsUseCase = new UpdateTariffsUseCase(
            tariffMetadataRepository,
            fetchTariffsUseCase,
            createTariffsUseCase,
            updateExistingTariffsUseCase
        );
        const getTariffsUseCase = new GetTariffsUseCase(tariffsRepository, tariffMetadataRepository);
        const getAvailableDatesUseCase = new GetAvailableDatesUseCase(tariffMetadataRepository);

        // Создаем экземпляры контроллеров
        const tariffsController = new TariffsController(
            getTariffsUseCase,
            getAvailableDatesUseCase,
            updateTariffsUseCase
        );
        const healthController = new HealthController();

        // Создаем роутер
        const appRouter = createAppRouter(tariffsController, healthController);
        app.use('/', appRouter);

        // Обработка ошибок
        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error('Unhandled error', {
                context: 'HTTP',
                errorInfo: {
                    reason: err.message,
                    location: 'Global error handler',
                    stack: err.stack
                }
            });
            res.status(500).json({ error: 'Internal server error' });
        });

        // Запускаем сервер
        app.listen(PORT, () => {
            console.log(`🎉 Server is running on port ${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    await knex.destroy();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    await knex.destroy();
    process.exit(0);
});

startApp();