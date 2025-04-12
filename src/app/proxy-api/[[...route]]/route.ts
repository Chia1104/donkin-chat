import { Hono } from 'hono';
import { proxy } from 'hono/proxy';
import { handle } from 'hono/vercel';

import { env } from '@/utils/env';
import { logger } from '@/utils/logger';

const app = new Hono();

app.all('/proxy-api/*', c => {
	const url = `${env.NEXT_PUBLIC_APP_API_HOST}${c.req.path.replace(/^\/proxy-api/, '').replace(/\/$/, '')}?${Object.entries(
		c.req.query(),
	)
		.map(([key, value]) => `${key}=${value}`)
		.join('&')}`;

	logger(['PROXY URL: ', url], { type: 'log' });

	return proxy(url, {
		...c.req, // optional, specify only when forwarding all the request data (including credentials) is necessary.
		headers: {
			...c.req.header(),
			'X-Forwarded-For': '127.0.0.1',
			'X-Forwarded-Host': c.req.header('host'),
		},
	});
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
