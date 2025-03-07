import { Hono } from 'hono';
import { proxy } from 'hono/proxy';
import { handle } from 'hono/vercel';

import { env } from '@/utils/env';

export const runtime = 'edge';

const app = new Hono();

app.all('/proxy-api/:path', c => {
	return proxy(`${env.NEXT_PUBLIC_APP_API_HOST}/${c.req.param('path')}`, {
		...c.req, // optional, specify only when forwarding all the request data (including credentials) is necessary.
		headers: {
			...c.req.header(),
			'X-Forwarded-For': '127.0.0.1',
			'X-Forwarded-Host': c.req.header('host'),
			Authorization: undefined, // do not propagate request headers contained in c.req.header('Authorization')
		},
	});
});

export const GET = handle(app);
export const POST = handle(app);
