import { Router } from 'express';
import { TariffsController } from '../controllers/TariffsController';

export function createTariffsRouter(tariffsController: TariffsController): Router {
    const router = Router();

    router.get('/dates', (req, res) => tariffsController.getAvailableDates(req, res));
    router.post('/sync', (req, res) => tariffsController.syncTariffs(req, res));
    router.get('/:date', (req, res) => tariffsController.getTariffsByDate(req, res));

    router.use('*', (req, res) => {
        res.status(404).json({
            error: 'Route not found',
            availableRoutes: [
                'GET /api/tariffs/dates',
                'POST /api/tariffs/sync',
                'GET /api/tariffs/:date'
            ],
            example: '/api/tariffs/2025-01-15'
        });
    });
    return router;
} 