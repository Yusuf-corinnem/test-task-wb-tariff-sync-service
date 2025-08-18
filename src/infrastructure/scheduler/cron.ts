import cron from 'node-cron';
import { UpdateTariffsUseCase } from '../../domain/usecases/UpdateTariffsUseCase.js';
import { ExportTariffsToSheetsUseCase } from '../../domain/usecases/ExportTariffsToSheetsUseCase.js';
import { logger } from '../../shared/utils/logger.js';
import { cronConfig } from '../../config/services/cron.config.js';

type SchedulerOptions = {
	cronExpression?: string;
	enabled?: boolean;
};

export function startScheduler(
	updateTariffsUseCase: UpdateTariffsUseCase,
	exportTariffsToSheetsUseCase: ExportTariffsToSheetsUseCase,
	options?: SchedulerOptions
) {
	const enabled = options?.enabled ?? cronConfig.enabled;
	const cronExpr = options?.cronExpression || cronConfig.schedule;

	if (!enabled) {
		logger.info('Cron scheduler disabled', { context: 'scheduler' });
		return;
	}

	let isRunning = false;

	logger.info('Starting cron scheduler', { context: 'scheduler', metadata: { cron: cronExpr } });

	cron.schedule(cronExpr, async () => {
		if (isRunning) {
			logger.warn('Previous cron task still running, skipping this tick', { context: 'scheduler' });
			return;
		}
		isRunning = true;

		const targetDate = new Date();
		try {
			logger.info('Cron tick: updating tariffs', { context: 'scheduler', metadata: { date: targetDate.toISOString() } });
			await updateTariffsUseCase.execute(targetDate);

			logger.info('Cron tick: exporting to Google Sheets', { context: 'scheduler', metadata: { date: targetDate.toISOString() } });
			await exportTariffsToSheetsUseCase.execute({ targetDate });

			logger.info('Cron tick: done', { context: 'scheduler' });
		} catch (error) {
			logger.error('Cron task failed', {
				context: 'scheduler',
				errorInfo: {
					reason: error instanceof Error ? error.message : 'Unknown error',
					location: 'scheduler',
					stack: error instanceof Error ? error.stack : undefined
				}
			});
		} finally {
			isRunning = false;
		}
	});
}


