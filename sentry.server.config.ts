import { init } from '@sentry/nextjs';

import { env } from './src/utils/env';

init({
	dsn: env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1.0,
	enabled: ['production', 'beta'].includes(env.NEXT_PUBLIC_APP_ENV),
	environment: env.NEXT_PUBLIC_APP_ENV,
});
