import { Tariff } from '../../domain/entities/Tariff';
import { TariffDto } from '../../http/dto/TariffDto';

export class TariffMapper {
    static toDto(entity: Tariff): TariffDto {
        return {
            id: entity.id,
            tariffMetadataId: entity.tariffMetadataId,
            warehouseName: entity.warehouseName,
            geoName: entity.geoName,
            boxDeliveryAndStorageExpr: '', // Deprecated field, оставляем пустым
            boxDeliveryCoefExpr: entity.boxDeliveryCoefExpr,
            boxStorageCoefExpr: entity.boxStorageCoefExpr,
            boxDeliveryBase: entity.boxDeliveryBase,
            boxStorageBase: entity.boxStorageBase,
            boxDeliveryLiter: entity.boxDeliveryLiter,
            boxStorageLiter: entity.boxStorageLiter,
            boxDeliveryMarketplaceBase: entity.boxDeliveryMarketplaceBase,
            boxDeliveryMarketplaceCoefExpr: entity.boxDeliveryMarketplaceCoefExpr,
            boxDeliveryMarketplaceLiter: entity.boxDeliveryMarketplaceLiter
        };
    }

    static toEntity(dto: TariffDto): Tariff {
        return new Tariff(
            dto.id || 0,
            dto.tariffMetadataId,
            dto.warehouseName,
            dto.geoName,
            dto.boxDeliveryCoefExpr,
            dto.boxStorageCoefExpr,
            dto.boxDeliveryBase,
            dto.boxStorageBase,
            dto.boxDeliveryLiter,
            dto.boxStorageLiter,
            dto.boxDeliveryMarketplaceBase,
            dto.boxDeliveryMarketplaceCoefExpr,
            dto.boxDeliveryMarketplaceLiter,
            new Date(), // createdAt
            new Date()  // updatedAt
        );
    }
} 