export interface IApiResponse<T = any> {
    data: T;
    message: string;
    status: 'success' | 'error';
}