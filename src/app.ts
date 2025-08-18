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
import { SheetsService } from './infrastructure/services/SheetsService.js';
import { ExportTariffsToSheetsUseCase } from './domain/usecases/ExportTariffsToSheetsUseCase.js';
import { SpreadsheetsController } from './http/controllers/SpreadsheetsController.js';

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
        logger.info('Starting service', { context: 'app.start' });

        logger.info('Running database migrations', { context: 'app.migrate' });
        await knex.migrate.latest();
        logger.info('Migrations completed', { context: 'app.migrate' });

        logger.info('Running database seeds', { context: 'app.seed' });
        await knex.seed.run();
        logger.info('Seeds completed', { context: 'app.seed' });

        // Создаем экземпляры репозиториев
        const tariffsRepository = new TariffsRepository(knex);
        const tariffMetadataRepository = new TariffMetadataRepository(knex);
        const spreadsheetsRepository = new SpreadsheetsRepository(knex);

        // Создаем экземпляры сервисов
        const wbService = new WBService();
        const sheetsService = new SheetsService();

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
        const exportTariffsToSheetsUseCase = new ExportTariffsToSheetsUseCase(
            getTariffsUseCase,
            spreadsheetsRepository,
            sheetsService
        );

        // Создаем экземпляры контроллеров
        const tariffsController = new TariffsController(
            getTariffsUseCase,
            getAvailableDatesUseCase,
            updateTariffsUseCase,
            exportTariffsToSheetsUseCase
        );
        const healthController = new HealthController();
        const spreadsheetsController = new SpreadsheetsController(spreadsheetsRepository);

        // Создаем роутер
        const appRouter = createAppRouter(tariffsController, healthController, spreadsheetsController);
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
            logger.info('Server is running', { context: 'app.listen', metadata: { port: PORT } });
        });

    } catch (error) {
        logger.error('Failed to start application', {
            context: 'app.start',
            errorInfo: { reason: (error as Error).message, stack: (error as Error).stack, location: 'app.start' }
        });
        process.exit(1);
    }
}

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down', { context: 'app.shutdown' });
    await knex.destroy();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down', { context: 'app.shutdown' });
    await knex.destroy();
    process.exit(0);
});

startApp();