import { Router } from 'express';
import { HealthController } from '../controllers/HealthController.js';

export function createHealthRouter(healthController: HealthController): Router {
    const router = Router();
    
    router.get('/', (req, res) => healthController.healthCheck(req, res));

    return router;
} 