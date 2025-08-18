import { Spreadsheet } from "../../domain/entities/Spreadsheet";

export class SpreadsheetMapper {
	static fromDbRow(row: any): Spreadsheet {
		return new Spreadsheet(
			row.id,
			row.spreadsheet_id,
			row.region_filter ?? null,
			row.description ?? null,
			Boolean(row.is_active),
			row.created_at ? new Date(row.created_at) : new Date()
		);
	}
}


