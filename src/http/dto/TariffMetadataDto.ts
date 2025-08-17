export interface TariffMetadataDto {
    id?: number;
    date: string;
    dt_till_max: string;
    dt_next_box?: string;  // Добавляем поле, которое может быть в БД
    created_at?: string;
    updated_at?: string;
} 