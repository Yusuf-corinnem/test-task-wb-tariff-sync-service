export interface IBaseLog {
    message: string;
    status: 'success' | 'error' | 'warning' | 'info';
    date: string;
    context?: string;
    metadata?: any;
}

export interface IErrorLog extends IBaseLog {
    status: 'error';
    errorInfo: IErrorLogInfo;
}

interface IErrorLogInfo {
    reason: string;
    location: string;
    stack?: string;
    details?: any;
}