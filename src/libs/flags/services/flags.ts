import { get } from '@vercel/edge-config';
import { flag } from 'flags/next';
import 'server-only';
import { z } from 'zod';

import { IS_DEV, env } from '@/utils/env';

export const getConfig = async (id: string) => get(id);

export const FlagID = {
	AIChat: 'flags-ai-chat',
	CookieFeatures: 'flags-cookie-features',
	InviteCode: 'flags-invite-code',
} as const;

export const aiChatFlag = flag<boolean>({
	key: FlagID.AIChat,
	decide() {
		return true;
	},
});

const DEFAULT_COOKIE_FEATURES = {
	settings: false,
};

const cookieFeaturesSchema = z
	.object({
		settings: z.boolean(),
	})
	.default(DEFAULT_COOKIE_FEATURES);

export type CookieFeatures = z.infer<typeof cookieFeaturesSchema>;

export const cookieFeaturesFlag = flag<CookieFeatures, CookieFeatures>({
	key: FlagID.CookieFeatures,
	identify({ cookies }) {
		try {
			const value = cookies.get(FlagID.CookieFeatures)?.value;
			if (!value) return undefined;
			return cookieFeaturesSchema.parse(JSON.parse(value));
		} catch {
			return DEFAULT_COOKIE_FEATURES;
		}
	},
	decide({ entities }) {
		if (!entities) return DEFAULT_COOKIE_FEATURES;
		return entities;
	},
});

export const inviteCodeFlag = flag<boolean>({
	key: FlagID.InviteCode,
	async decide() {
		try {
			if (IS_DEV) return env.FLAGS_INVITE_CODE === 'true' || env.FLAGS_INVITE_CODE === '1';
			const config = await getConfig(FlagID.InviteCode);
			return config === 'true' || config === '1';
		} catch {
			return false;
		}
	},
});
