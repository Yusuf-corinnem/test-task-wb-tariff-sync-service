export class Spreadsheet {
    constructor(
        public readonly id: number,
        public readonly spreadsheetId: string,
        public readonly regionFilter: string | null,
        public readonly description: string | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date
    ) { }

    /**
     * Проверяет, подходит ли таблица для указанного региона
     */
    matchesRegion(region: string): boolean {
        if (!this.regionFilter) return true; // Если фильтр не задан, подходит для всех
        return this.regionFilter.toLowerCase() === region.toLowerCase();
    }

    /**
     * Проверяет, можно ли использовать таблицу
     */
    canBeUsed(): boolean {
        return this.isActive && this.spreadsheetId.length > 0;
    }

    /**
     * Возвращает URL для таблицы
     */
    getUrl(): string {
        return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`;
    }
}