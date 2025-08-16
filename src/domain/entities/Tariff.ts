export class Tariff {
    constructor(
        public readonly id: number,
        public readonly tariffMetadataId: number,
        public readonly warehouseName: string,
        public readonly geoName: string,
        public readonly boxDeliveryAndStorageCoefficient: number,
        public readonly boxDeliveryCoefficient: number,
        public readonly boxStorageCoefficient: number,
        public readonly boxDeliveryBase: number,
        public readonly boxStorageBase: number,
        public readonly boxDeliveryLiter: number,
        public readonly boxStorageLiter: number,
        public readonly boxDeliveryMarketplaceBase: number,
        public readonly boxDeliveryMarketplaceCoefficient: number,
        public readonly boxDeliveryMarketplaceLiter: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}