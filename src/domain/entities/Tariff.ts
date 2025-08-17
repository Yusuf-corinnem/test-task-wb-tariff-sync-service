export class Tariff {
    constructor(
        public readonly id: number,
        public readonly tariffMetadataId: number,
        public readonly warehouseName: string,
        public readonly geoName: string,
        // boxDeliveryAndStorageExpr - deprecated, будет удалено 19.08.2025
        public readonly boxDeliveryCoefExpr: string,
        public readonly boxStorageCoefExpr: string,
        public readonly boxDeliveryBase: string,
        public readonly boxStorageBase: string,
        public readonly boxDeliveryLiter: string,
        public readonly boxStorageLiter: string,
        public readonly boxDeliveryMarketplaceBase: string,
        public readonly boxDeliveryMarketplaceCoefExpr: string,
        public readonly boxDeliveryMarketplaceLiter: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}