export class TariffMetadata {
    constructor(
        public readonly id: number,
        public readonly date: Date,
        public readonly dtTillMax: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    /**
      * Проверяет, актуален ли тариф на указанную дату
      */
    isActiveOnDate(checkDate: Date): boolean {
        return checkDate >= this.date && checkDate <= this.dtTillMax;
    }
}