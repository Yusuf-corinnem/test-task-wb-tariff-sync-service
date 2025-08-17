import { TariffMetadata } from '../../domain/entities/TariffMetadata';
import { TariffMetadataDto } from '../../http/dto/TariffMetadataDto';

export class TariffMetadataMapper {
    static toDto(entity: TariffMetadata): TariffMetadataDto {
        return {
            id: entity.id,
            date: entity.date?.toISOString() || new Date().toISOString(),
            dtNextBox: entity.dtNextBox?.toISOString() || undefined,
            dtTillMax: entity.dtTillMax?.toISOString() || undefined,
            createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: entity.updatedAt?.toISOString() || new Date().toISOString()
        };
    }

    static toEntity(dto: TariffMetadataDto): TariffMetadata {
        return new TariffMetadata(
            dto.id || 0,
            new Date(dto.date),
            dto.dtNextBox ? new Date(dto.dtNextBox) : null,
            dto.dtTillMax ? new Date(dto.dtTillMax) : null,
            dto.createdAt ? new Date(dto.createdAt) : new Date(),
            dto.updatedAt ? new Date(dto.updatedAt) : new Date()
        );
    }
} 