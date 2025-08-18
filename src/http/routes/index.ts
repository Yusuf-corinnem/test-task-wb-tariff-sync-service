import { Router } from 'express';
import { createTariffsRouter } from './tariffs.js';
import { createHealthRouter } from './health.js';
import { createSpreadsheetsRouter } from './spreadsheets.js';

export function createAppRouter(tariffsController: any, healthController: any, spreadsheetsController?: any): Router {
    const router = Router();

    // API маршруты
    router.use('/api/tariffs', createTariffsRouter(tariffsController));
    router.use('/api/health', createHealthRouter(healthController));
    if (spreadsheetsController) {
        router.use('/api/spreadsheets', createSpreadsheetsRouter(spreadsheetsController));
    }

    // Корневой маршрут
    router.get('/', (req, res) => {
        res.json({
            service: 'WB Tariff Sync Service',
            version: '1.0.0',
            description: 'Service for synchronizing WB tariffs with Google Sheets',
            endpoints: {
                health: '/api/health',
                tariffs: '/api/tariffs',
                spreadsheets: '/api/spreadsheets',
                dates: '/api/tariffs/dates',
                getTariffs: '/api/tariffs/:date'
            },
            timestamp: new Date().toISOString()
        });
    });

    // Обработка 404 для всех остальных маршрутов
    router.use('*', (req, res) => {
        res.status(404).json({
            error: 'Route not found',
            availableRoutes: [
                'GET /',
                'GET /api/health',
                'GET /api/tariffs/dates',
                'GET /api/tariffs/:date'
            ],
            timestamp: new Date().toISOString()
        });
    });

    return router;
} 