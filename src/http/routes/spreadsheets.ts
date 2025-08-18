import { Router } from 'express';
import { SpreadsheetsController } from '../controllers/SpreadsheetsController.js';

export function createSpreadsheetsRouter(controller: SpreadsheetsController): Router {
	const router = Router();

	router.get('/', (req, res) => controller.findAll(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));

	router.use('*', (req, res) => {
		res.status(404).json({
			error: 'Route not found',
			availableRoutes: ['GET /api/spreadsheets', 'POST /api/spreadsheets', 'PUT /api/spreadsheets/:id'],
		});
	});

	return router;
}


