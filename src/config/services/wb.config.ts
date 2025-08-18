import env from "../env/env.js";

export const wbConfig = {
    apiKey: env.WB_API_KEY || '',
    baseUrl: env.WB_API_BASE_URL || 'https://common-api.wildberries.ru/api/v1',
    timeout: env.WB_TIMEOUT || 30000,
    retryAttempts: (env.WB_RETRY_ATTEMPTS as unknown as number) || 3
};