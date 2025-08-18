import { SheetsService } from "./SheetsService.js";
import { sheetsLayout } from "../../config/services/sheets.config.js";
import { sheetsRowBuilders } from "../../shared/builders/sheets.js";

export class SheetsExportService {
	constructor(private readonly sheetsService: SheetsService) {}

	async exportAll(
		spreadsheetId: string,
		tariffs: any[],
		dateStr: string,
		meta: { dt_till_max?: string | null }
	): Promise<void> {
		await this.sheetsService.rewriteSheet(
			spreadsheetId,
			sheetsLayout.coefs.title,
			sheetsLayout.coefs.headers,
			sheetsRowBuilders.coefs(tariffs, dateStr)
		);

		await this.sheetsService.rewriteSheet(
			spreadsheetId,
			sheetsLayout.delivery.title,
			sheetsLayout.delivery.headers,
			sheetsRowBuilders.delivery(tariffs, dateStr)
		);

		await this.sheetsService.rewriteSheet(
			spreadsheetId,
			sheetsLayout.storage.title,
			sheetsLayout.storage.headers,
			sheetsRowBuilders.storage(tariffs, dateStr)
		);

		await this.sheetsService.rewriteSheet(
			spreadsheetId,
			sheetsLayout.meta.title,
			sheetsLayout.meta.headers,
			sheetsRowBuilders.meta(dateStr, meta.dt_till_max || "")
		);
	}
}


