import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import * as schema from 'src/database/server/schema';

import { db } from '@/database/server';

export const auth = betterAuth({
	appName: 'Donkin',

	emailAndPassword: {
		enabled: true,
	},

	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),

	plugins: [admin()],
});
