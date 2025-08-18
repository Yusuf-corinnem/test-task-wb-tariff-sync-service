import { TariffMetadata } from '../../domain/entities/TariffMetadata';
import { TariffMetadataDto } from '../../http/dto/TariffMetadataDto';

export class TariffMetadataMapper {
    // Преобразование Entity → DTO (camelCase → snake_case)
    static toDto(entity: TariffMetadata): TariffMetadataDto {
        return {
            id: entity.id,
            date: entity.date?.toISOString() || new Date().toISOString(),
            dt_till_max: entity.dtTillMax?.toISOString() || '',
            dt_next_box: entity.dtNextBox?.toISOString() || undefined,
            created_at: entity.createdAt?.toISOString() || new Date().toISOString(),
            updated_at: entity.updatedAt?.toISOString() || new Date().toISOString()
        };
    }

    // Преобразование DTO → Entity (snake_case → camelCase)
    static toEntity(dto: TariffMetadataDto): TariffMetadata {
        return new TariffMetadata(
            dto.id || 0,
            new Date(dto.date),
            dto.dt_till_max ? new Date(dto.dt_till_max) : null,
            dto.dt_next_box ? new Date(dto.dt_next_box) : null,
            dto.created_at ? new Date(dto.created_at) : new Date(),
            dto.updated_at ? new Date(dto.updated_at) : new Date()
        );
    }
} 