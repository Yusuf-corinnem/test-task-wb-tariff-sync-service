import env from "../env/env";

console.log('WB Config Debug:', {
    WB_API_KEY: env.WB_API_KEY,
    WB_API_BASE_URL: env.WB_API_BASE_URL,
    WB_TIMEOUT: env.WB_TIMEOUT,
    hasApiKey: !!env.WB_API_KEY
});

export const wbConfig = {
    apiKey: env.WB_API_KEY || '',
    baseUrl: env.WB_API_BASE_URL || 'https://common-api.wildberries.ru/api/v1',
    timeout: env.WB_TIMEOUT || 30000,
    retryAttempts: 3
};