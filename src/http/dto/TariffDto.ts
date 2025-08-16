export interface TariffDto {
    id?: number;
    tariffMetadataId: number;
    warehouseName: string;
    geoName: string;
    boxDeliveryAndStorageCoefficient: number;
    boxDeliveryCoefficient: number;
    boxStorageCoefficient: number;
    boxDeliveryBase: number;
    boxStorageBase: number;
    boxDeliveryLiter: number;
    boxStorageLiter: number;
    boxDeliveryMarketplaceBase: number;
    boxDeliveryMarketplaceCoefficient: number;
    boxDeliveryMarketplaceLiter: number;
}   