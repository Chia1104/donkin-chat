import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getAppEnv = () => {
	if (process.env.NEXT_PUBLIC_APP_ENV) {
		return process.env.NEXT_PUBLIC_APP_ENV;
	}

	return 'development';
};

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'test', 'production']),
		SENTRY_AUTH_TOKEN: z.string().optional(),
		SENTRY_ORG: z.string().optional(),
		SENTRY_PROJECT: z.string().optional(),
		OPENAI_API_KEY: z.string().optional(),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
	},

	client: {
		NEXT_PUBLIC_SITE_URL: z.string().min(1),
		NEXT_PUBLIC_APP_ENV: z.enum(['development', 'local', 'production', 'beta', 'gamma', 'test']),
		NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
		NEXT_PUBLIC_GTM_ID: z.string().optional(),
		NEXT_PUBLIC_GA_ID: z.string().optional(),
		NEXT_PUBLIC_APP_API_HOST: z.string().min(1),
		NEXT_PUBLIC_DEFAULT_TIME_ZONE: z.string().min(1),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_ENV: getAppEnv(),
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://donkin.verce.app',
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		SENTRY_ORG: process.env.SENTRY_ORG,
		SENTRY_PROJECT: process.env.SENTRY_PROJECT,
		NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
		NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
		NEXT_PUBLIC_APP_API_HOST: process.env.NEXT_PUBLIC_APP_API_HOST,
		NEXT_PUBLIC_DEFAULT_TIME_ZONE: process.env.NEXT_PUBLIC_DEFAULT_TIME_ZONE || 'Asia/Taipei',
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	},

	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true' || process.env.SKIP_ENV_VALIDATION === '1',

	emptyStringAsUndefined: true,

	extends: [],
});

export const IS_PRODUCTION = env.NEXT_PUBLIC_APP_ENV === 'production';
export const IS_DEV = env.NEXT_PUBLIC_APP_ENV === 'development' || env.NEXT_PUBLIC_APP_ENV === 'local';
