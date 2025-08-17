import env from "../env/env";

export const wbConfig = {
    apiKey: env.WB_API_KEY || '',
    baseUrl: env.WB_API_BASE_URL || 'https://common-api.wildberries.ru/api/v1',
    timeout: env.WB_TIMEOUT || 30000,
    retryAttempts: 3
};