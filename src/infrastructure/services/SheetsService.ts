import { google } from "googleapis";
import googleConfig from "../../config/services/google.config.js";
import { logger } from "../../shared/utils/logger.js";

export class SheetsService {
	private sheets = google.sheets("v4");
	private auth = new google.auth.JWT({
		email: googleConfig.clientEmail,
		key: googleConfig.privateKey,
		scopes: googleConfig.scopes,
	});

	async clearSheet(spreadsheetId: string, sheetTitle: string): Promise<void> {
		logger.info("Clearing Google Sheet", {
			context: "SheetsService.clearSheet",
			metadata: { spreadsheetId, sheetTitle },
		});
		await this.sheets.spreadsheets.values.clear({
			spreadsheetId,
			range: `${sheetTitle}!A:Z`,
			auth: this.auth,
		});
	}

	async writeValues(
		spreadsheetId: string,
		sheetTitle: string,
		headers: string[],
		rows: (string | number | null)[][]
	): Promise<void> {
		logger.info("Writing values to Google Sheet", {
			context: "SheetsService.writeValues",
			metadata: { spreadsheetId, sheetTitle, rows: rows.length },
		});
		await this.sheets.spreadsheets.values.update({
			spreadsheetId,
			range: `${sheetTitle}!A1`,
			valueInputOption: "RAW",
			requestBody: { values: [headers, ...rows] },
			auth: this.auth,
		});
	}

	async rewriteSheet(
		spreadsheetId: string,
		sheetTitle: string,
		headers: string[],
		rows: (string | number | null)[][]
	): Promise<void> {
		await this.clearSheet(spreadsheetId, sheetTitle);
		await this.writeValues(spreadsheetId, sheetTitle, headers, rows);
	}
}


