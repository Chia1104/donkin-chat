import { get } from '@vercel/edge-config';
import { flag } from 'flags/next';
import 'server-only';
import { z } from 'zod';

export const getConfig = async (id: string) => get(id);

export const FlagID = {
	AIChat: 'flags-ai-chat',
	CookieFeatures: 'flags-cookie-features',
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

type CookieFeatures = z.infer<typeof cookieFeaturesSchema>;

export const cookieFeaturesFlag = flag<CookieFeatures, CookieFeatures>({
	key: FlagID.CookieFeatures,
	identify({ cookies }) {
		const value = cookies.get(FlagID.CookieFeatures)?.value;
		if (!value) return undefined;
		return cookieFeaturesSchema.parse(JSON.parse(value));
	},
	decide({ entities }) {
		if (!entities) return DEFAULT_COOKIE_FEATURES;
		return entities;
	},
});
