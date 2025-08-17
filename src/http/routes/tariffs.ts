import { Router } from 'express';
import { TariffsController } from '../controllers/TariffsController';

export function createTariffsRouter(tariffsController: TariffsController): Router {
    const router = Router();

    const validateDate = (req: any, res: any, next: any) => {
        const { date } = req.params;
        if (!date) {
            return res.status(400).json({
                error: 'Date parameter is required',
                example: '/api/tariffs/2025-01-15'
            });
        }
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD',
                received: date,
                example: '2025-01-15'
            });
        }
        if (targetDate > new Date()) {
            return res.status(400).json({
                error: 'Date cannot be in the future',
                received: date
            });
        }
        req.validatedDate = targetDate;
        next();
    };

    // Сначала конкретные маршруты, потом параметризованные
    router.get('/dates', (req, res) => tariffsController.getAvailableDates(req, res));
    router.post('/sync', (req, res) => tariffsController.syncTariffs(req, res));
    router.get('/:date', validateDate, (req, res) => tariffsController.getTariffsByDate(req, res));

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