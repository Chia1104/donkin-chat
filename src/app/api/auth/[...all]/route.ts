import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/libs/auth/server';

export const { GET, POST } = toNextJsHandler(auth.handler);
