import winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';
import { IBaseLog, IErrorLog } from '../types/logs.js';

// Создаем форматтер для структурированных логов
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Путь к папке логов
const logsDir = join(process.cwd(), 'src', 'logs');

// Создаем логгер
export const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        // Логи в консоль
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Ротация логов ошибок
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // Ротация всех логов
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

export interface ILogger {
    info(message: string, meta?: Partial<IBaseLog>): void;
    error(message: string, meta?: Partial<IErrorLog>): void;
    warn(message: string, meta?: Partial<IBaseLog>): void;
    debug(message: string, meta?: Partial<IBaseLog>): void;
}

export const logger: ILogger = {
    info: (message: string, meta?: Partial<IBaseLog>) => {
        const logEntry: IBaseLog = {
            message,
            status: 'info',
            date: new Date().toISOString(),
            context: meta?.context,
            metadata: meta?.metadata
        };
        winstonLogger.info(logEntry);
    },

    error: (message: string, meta?: Partial<IErrorLog>) => {
        const logEntry: IErrorLog = {
            message,
            status: 'error',
            date: new Date().toISOString(),
            context: meta?.context,
            metadata: meta?.metadata,
            errorInfo: {
                reason: meta?.errorInfo?.reason || 'Unknown error',
                location: meta?.errorInfo?.location || 'Unknown location',
                stack: meta?.errorInfo?.stack,
                details: meta?.errorInfo?.details
            }
        };
        winstonLogger.error(logEntry);
    },

    warn: (message: string, meta?: Partial<IBaseLog>) => {
        const logEntry: IBaseLog = {
            message,
            status: 'warning',
            date: new Date().toISOString(),
            context: meta?.context,
            metadata: meta?.metadata
        };
        winstonLogger.warn(logEntry);
    },

    debug: (message: string, meta?: Partial<IBaseLog>) => {
        const logEntry: IBaseLog = {
            message,
            status: 'info',
            date: new Date().toISOString(),
            context: meta?.context,
            metadata: meta?.metadata
        };
        winstonLogger.debug(logEntry);
    }
}; 