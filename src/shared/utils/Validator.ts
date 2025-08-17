export class Validator {
    static validateDate(date: Date): void {
        if (!date) {
            throw new Error('Date is required');
        }

        if (!(date instanceof Date)) {
            throw new Error('Date must be a Date object');
        }

        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        if (date > new Date()) {
            throw new Error('Date cannot be in the future');
        }

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (date < oneYearAgo) {
            throw new Error('Date cannot be older than 1 year');
        }
    }

    static validateString(value: string, fieldName: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error(`${fieldName} is required`);
        }
    }

    static validateNumber(value: number, fieldName: string): void {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${fieldName} must be a valid number`);
        }
    }
}