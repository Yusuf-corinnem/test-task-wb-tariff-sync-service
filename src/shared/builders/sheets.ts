import { sheetsLayout } from "../../config/services/sheets.config.js";

type Row = (string | number | null)[];

export const sheetsRowBuilders = {
	coefs: (tariffs: any[], dateStr: string): Row[] =>
		mapAndSortRows(
			tariffs,
			dateStr,
			(t, d) => [
				d,
				t.geoName,
				t.warehouseName,
				t.boxDeliveryCoefExpr || null,
				t.boxStorageCoefExpr || null,
				t.boxDeliveryAndStorageExpr || null,
				t.boxDeliveryMarketplaceCoefExpr || null,
			],
			sheetsLayout.coefs.sortByIndex ?? 5
		),

	delivery: (tariffs: any[], dateStr: string): Row[] =>
		mapAndSortRows(
			tariffs,
			dateStr,
			(t, d) => [
				d,
				t.geoName,
				t.warehouseName,
				t.boxDeliveryCoefExpr || null,
				t.boxDeliveryBase || null,
				t.boxDeliveryLiter || null,
				t.boxDeliveryMarketplaceCoefExpr || null,
				t.boxDeliveryMarketplaceBase || null,
				t.boxDeliveryMarketplaceLiter || null,
			],
			sheetsLayout.delivery.sortByIndex ?? 0
		),

	storage: (tariffs: any[], dateStr: string): Row[] =>
		mapAndSortRows(
			tariffs,
			dateStr,
			(t, d) => [
				d,
				t.geoName,
				t.warehouseName,
				t.boxStorageCoefExpr || null,
				t.boxStorageBase || null,
				t.boxStorageLiter || null,
			],
			sheetsLayout.storage.sortByIndex ?? 0
		),

	meta: (dateStr: string, dtTillMax: string, dtNextBox: string): Row[] => [[
		dateStr,
		dtNextBox,
		dtTillMax,
		new Date().toISOString(),
	]],
};

function mapAndSortRows(
	tariffs: any[],
	dateStr: string,
	toRow: (t: any, d: string) => Row,
	sortByIndex: number
): Row[] {
	const rows = tariffs.map((t) => toRow(t, dateStr));
	return sortRows(rows, sortByIndex);
}

function sortRows(rows: Row[], sortByIndex: number): Row[] {
	return rows.sort((a, b) => {
		const av = Number(a[sortByIndex]);
		const bv = Number(b[sortByIndex]);
		if (Number.isNaN(av) && Number.isNaN(bv)) return 0;
		if (Number.isNaN(av)) return 1;
		if (Number.isNaN(bv)) return -1;
		return av - bv;
	});
}


