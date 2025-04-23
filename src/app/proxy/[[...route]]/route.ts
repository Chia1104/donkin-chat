import { Hono } from 'hono';
import { proxy } from 'hono/proxy';
import { handle } from 'hono/vercel';

import { withRateLimiter, presetRateLimiter } from '@/libs/kv/services/with-rate-limiter';
import { env } from '@/utils/env';
import { logger } from '@/utils/logger';

const app = new Hono();

const enabledRateLimiter = false;

app.all('/proxy/*', c => {
	const url = `${env.NEXT_PUBLIC_PUBLIC_SERVICE_ENDPOINT}${c.req.path.replace(/^\/proxy/, '').replace(/\/$/, '')}?${Object.entries(
		c.req.query(),
	)
		.map(([key, value]) => `${key}=${value}`)
		.join('&')}`;

	logger(['PROXY URL (PUBLIC SERVICE): ', url], { type: 'log' });

	return proxy(url, {
		...c.req, // optional, specify only when forwarding all the request data (including credentials) is necessary.
		headers: {
			...c.req.header(),
			'X-Forwarded-For': '127.0.0.1',
			'X-Forwarded-Host': c.req.header('host'),
		},
	});
});

export const GET = withRateLimiter(
	handle(app),
	presetRateLimiter({
		enabled: enabledRateLimiter,
	}),
);
export const POST = withRateLimiter(
	handle(app),
	presetRateLimiter({
		enabled: enabledRateLimiter,
	}),
);
export const PUT = withRateLimiter(
	handle(app),
	presetRateLimiter({
		enabled: enabledRateLimiter,
	}),
);
export const PATCH = withRateLimiter(
	handle(app),
	presetRateLimiter({
		enabled: enabledRateLimiter,
	}),
);
export const DELETE = withRateLimiter(
	handle(app),
	presetRateLimiter({
		enabled: enabledRateLimiter,
	}),
);
