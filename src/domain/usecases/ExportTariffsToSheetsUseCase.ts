import { SpreadsheetsRepository } from "../../infrastructure/repositories/SpreadsheetsRepository.js";
import { SheetsService } from "../../infrastructure/services/SheetsService.js";
import { logger } from "../../shared/utils/logger.js";
import { GetTariffsUseCase } from "./GetTariffsUseCase.js";
import { sheetsLayout } from "../../config/services/sheets.config.js";
import { sheetsRowBuilders } from "../../shared/builders/sheets.js";
import { SheetsExportService } from "../../infrastructure/services/SheetsExportService.js";

type SortKey =
	| "box_delivery_and_storage_coefficient"
	| "box_delivery_coefficient"
	| "box_storage_coefficient";

export class ExportTariffsToSheetsUseCase {
	constructor(
		private readonly getTariffsUseCase: GetTariffsUseCase,
		private readonly spreadsheetsRepository: SpreadsheetsRepository,
		private readonly sheetsService: SheetsService
	) {}

	async execute(options?: { targetDate?: Date }): Promise<void> {
		const date = options?.targetDate ?? new Date();

		logger.info("Starting export to Google Sheets", {
			context: "ExportTariffsToSheetsUseCase.execute",
			metadata: { date: date.toISOString() },
		});

		const dateStr = date.toISOString().split("T")[0];
		const result = await this.getTariffsUseCase.execute(dateStr);
		if (!result || !result.metadata) {
			logger.warn("No metadata for date, export skipped", {
				context: "ExportTariffsToSheetsUseCase.execute",
				metadata: { date: date.toISOString() },
			});
			return;
		}

		const tariffs = result.tariffs;

		const spreadsheets = await this.spreadsheetsRepository.findActive();
		const exporter = new SheetsExportService(this.sheetsService);
		for (const sheet of spreadsheets) {
			try {
				// Фильтр по региону для конкретного Spreadsheet (без учета регистра/пробелов)
				const normalizedFilter = this.normalizeRegion(sheet.regionFilter);
				const regionalTariffs = normalizedFilter
					? tariffs.filter((t) => this.normalizeRegion(t.geoName) === normalizedFilter)
					: tariffs;

				await exporter.exportAll(sheet.spreadsheetId, regionalTariffs, dateStr, {
					dt_till_max: result.metadata.dt_till_max || ""
				});

				logger.info("Exported to spreadsheet", {
					context: "ExportTariffsToSheetsUseCase.execute",
					metadata: { spreadsheetId: sheet.spreadsheetId, rows: regionalTariffs.length },
				});
			} catch (e) {
				logger.error("Failed to export spreadsheet", {
					context: "ExportTariffsToSheetsUseCase.execute",
					errorInfo: {
						reason: e instanceof Error ? e.message : "Unknown error",
						location: "ExportTariffsToSheetsUseCase.execute",
						stack: e instanceof Error ? e.stack : undefined,
						details: { spreadsheetId: sheet.spreadsheetId },
					},
				});
			}
		}
	}

	private normalizeRegion(value?: string | null): string {
		return (value ?? '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
	}

}


