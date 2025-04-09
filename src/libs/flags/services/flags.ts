import { get } from '@vercel/edge-config';
import { flag } from 'flags/next';
import 'server-only';

import { env } from '@/utils/env';
import { tryCatch } from '@/utils/try-catch';

const getConfig = async (id: string) => get(id);

export const FlagID = {
	AIChat: 'flags-ai-chat',
} as const;

export const aiChatFlag = flag<boolean>({
	key: FlagID.AIChat,
	async decide() {
		const { data: config, error } = await tryCatch(getConfig(FlagID.AIChat));

		if (!config || error) {
			return env.FLAGS_AI_CHAT === 'true' && (!!env.OPENAI_API_KEY || !!env.OPENROUTER_API_KEY);
		}

		return config === 'true' && (!!env.OPENAI_API_KEY || !!env.OPENROUTER_API_KEY);
	},
});
