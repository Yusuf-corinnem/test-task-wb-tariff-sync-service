import { Request, Response } from 'express';
import { createSuccessResponse, createServerErrorResponse } from '../../shared/utils/apiResponse.js';

export class HealthController {
    /**
     * Проверка статуса сервиса
     */
    async healthCheck(req: Request, res: Response): Promise<void> {
        try {
            const response = createSuccessResponse({
                status: 'healthy',
                service: 'WB Tariff Sync Service',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }, 'Service is healthy');

            res.status(200).json(response);
        } catch (error) {
            const response = createServerErrorResponse('Health check failed');
            res.status(500).json(response);
        }
    }
} 