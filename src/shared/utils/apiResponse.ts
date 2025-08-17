import { IApiResponse } from '../types/api.js';

/**
 * Создает успешный ответ API
 */
export function createSuccessResponse<T>(
    data: T,
    message: string = 'Success'
): IApiResponse<T> {
    return {
        data,
        message,
        status: 'success'
    };
}

/**
 * Создает ответ с ошибкой API
 */
export function createErrorResponse(
    message: string = 'Error occurred',
    data: any = null
): IApiResponse<any> {
    return {
        data,
        message,
        status: 'error'
    };
}

/**
 * Создает ответ с ошибкой валидации
 */
export function createValidationErrorResponse(
    message: string = 'Validation failed',
    field?: string
): IApiResponse<null> {
    return createErrorResponse(
        field ? `${message}: ${field}` : message,
        null
    );
}

/**
 * Создает ответ с ошибкой "не найдено"
 */
export function createNotFoundResponse(
    resource: string = 'Resource'
): IApiResponse<null> {
    return createErrorResponse(
        `${resource} not found`,
        null
    );
}

/**
 * Создает ответ с ошибкой сервера
 */
export function createServerErrorResponse(
    message: string = 'Internal server error'
): IApiResponse<null> {
    return createErrorResponse(message, null);
} 