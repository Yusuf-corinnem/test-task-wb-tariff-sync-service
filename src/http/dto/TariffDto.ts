export interface TariffDto {
    id?: number;
    tariffMetadataId: number;
    warehouseName: string;
    geoName: string;
    boxDeliveryAndStorageExpr: string;        // Deprecated, будет удалено 19.08.2025
    boxDeliveryCoefExpr: string;
    boxStorageCoefExpr: string;
    boxDeliveryBase: string;
    boxStorageBase: string;
    boxDeliveryLiter: string;
    boxStorageLiter: string;
    boxDeliveryMarketplaceBase: string;
    boxDeliveryMarketplaceCoefExpr: string;
    boxDeliveryMarketplaceLiter: string;
}   