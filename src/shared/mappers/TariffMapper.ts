import { Tariff } from '../../domain/entities/Tariff';
import { TariffDto } from '../../http/dto/TariffDto';

function toNullableInt(value?: string): number | null {
    if (!value || value === '-' || value.trim() === '') return null;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? null : n;
}

function toNullableFloat(value?: string): number | null {
    if (!value || value === '-' || value.trim() === '') return null;
    const normalized = value.replace(',', '.');
    const n = parseFloat(normalized);
    return Number.isNaN(n) ? null : n;
}

export class TariffMapper {
    static toEntity(dto: TariffDto): Tariff {
        return new Tariff(
            dto.id || 0,
            dto.tariffMetadataId || 0,
            dto.warehouseName,
            dto.geoName,
            dto.boxDeliveryAndStorageExpr,
            dto.boxDeliveryCoefExpr,
            dto.boxStorageCoefExpr,
            dto.boxDeliveryBase,
            dto.boxStorageBase,
            dto.boxDeliveryLiter,
            dto.boxStorageLiter,
            dto.boxDeliveryMarketplaceBase,
            dto.boxDeliveryMarketplaceCoefExpr,
            dto.boxDeliveryMarketplaceLiter,
            new Date(),
            new Date()
        );
    }

    // Entity → БД (camelCase → snake_case + типы)
    static toDbRow(entity: Tariff) {
        return {
            id: entity.id,
            tariff_metadata_id: entity.tariffMetadataId,
            warehouse_name: entity.warehouseName,
            geo_name: entity.geoName,
            box_delivery_and_storage_coefficient: toNullableInt(entity.boxDeliveryAndStorageExpr),
            box_delivery_coefficient: toNullableInt(entity.boxDeliveryCoefExpr),
            box_storage_coefficient: toNullableInt(entity.boxStorageCoefExpr),
            box_delivery_base: toNullableFloat(entity.boxDeliveryBase),
            box_storage_base: toNullableFloat(entity.boxStorageBase),
            box_delivery_liter: toNullableFloat(entity.boxDeliveryLiter),
            box_storage_liter: toNullableFloat(entity.boxStorageLiter),
            box_delivery_marketplace_base: toNullableFloat(entity.boxDeliveryMarketplaceBase),
            box_delivery_marketplace_coefficient: toNullableInt(entity.boxDeliveryMarketplaceCoefExpr),
            box_delivery_marketplace_liter: toNullableFloat(entity.boxDeliveryMarketplaceLiter),
        };
    }

    // БД → Entity (snake_case → camelCase; числа → строки)
    static fromDbRow(row: any): Tariff {
        const toStr = (v: any) => (v === null || v === undefined ? '' : String(v));
        return new Tariff(
            row.id || 0,
            row.tariff_metadata_id,
            row.warehouse_name,
            row.geo_name,
            toStr(row.box_delivery_and_storage_coefficient),
            toStr(row.box_delivery_coefficient),
            toStr(row.box_storage_coefficient),
            toStr(row.box_delivery_base),
            toStr(row.box_storage_base),
            toStr(row.box_delivery_liter),
            toStr(row.box_storage_liter),
            toStr(row.box_delivery_marketplace_base),
            toStr(row.box_delivery_marketplace_coefficient),
            toStr(row.box_delivery_marketplace_liter),
            row.created_at ? new Date(row.created_at) : new Date(),
            row.updated_at ? new Date(row.updated_at) : new Date()
        );
    }
} 