export type SheetLayout = {
	title: string;
	headers: string[];
	sortByIndex?: number;
};

export const sheetsLayout: {
	coefs: SheetLayout;
	delivery: SheetLayout;
	storage: SheetLayout;
	meta: SheetLayout;
} = {
	coefs: {
		title: "stocks_coefs",
		headers: [
			"date",
			"geoName",
			"warehouseName",
			"boxDeliveryCoefExpr",
			"boxStorageCoefExpr",
			"boxDeliveryAndStorageExpr",
			"boxDeliveryMarketplaceCoefExpr",
		],
		sortByIndex: 5, // сортировка по boxDeliveryAndStorageExpr
	},
	delivery: {
		title: "stocks_delivery",
		headers: [
			"date",
			"geoName",
			"warehouseName",
			"boxDeliveryCoefExpr",
			"boxDeliveryBase",
			"boxDeliveryLiter",
			"boxDeliveryMarketplaceCoefExpr",
			"boxDeliveryMarketplaceBase",
			"boxDeliveryMarketplaceLiter",
		],
		sortByIndex: 3 // сортировка по boxDeliveryCoefExpr
	},
	storage: {
		title: "stocks_storage",
		headers: [
			"date",
			"geoName",
			"warehouseName",
			"boxStorageCoefExpr",
			"boxStorageBase",
			"boxStorageLiter",
		],
		sortByIndex: 3 // сортировка по boxStorageCoefExpr
	},
	meta: {
		title: "stocks_meta",
		headers: ["date", "dtNextBox", "dtTillMax", "lastUpdatedAt"],
		sortByIndex: 0 // сортировка по date
	},
};


