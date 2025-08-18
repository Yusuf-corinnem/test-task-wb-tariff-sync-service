import env from "../env/env.js";

export const cronConfig = {
	enabled: (env.CRON_ENABLED ?? 'true') === 'true',
	schedule: env.CRON_SCHEDULE || '0 * * * *',
};

export default cronConfig;