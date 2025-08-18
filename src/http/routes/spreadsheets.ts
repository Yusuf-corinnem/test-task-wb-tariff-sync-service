import { Router } from 'express';
import { SpreadsheetsController } from '../controllers/SpreadsheetsController.js';

export function createSpreadsheetsRouter(controller: SpreadsheetsController): Router {
	const router = Router();

	router.post('/', (req, res) => controller.create(req, res));

	router.use('*', (req, res) => {
		res.status(404).json({
			error: 'Route not found',
			availableRoutes: ['POST /api/spreadsheets'],
		});
	});

	return router;
}


