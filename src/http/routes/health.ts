import { Router } from 'express';
import { HealthController } from '../controllers/HealthController.js';

export function createHealthRouter(healthController: HealthController): Router {
    const router = Router();

    // Health check
    router.get('/', (req, res) => healthController.healthCheck(req, res));

    return router;
} 