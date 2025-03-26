import { get } from '@vercel/edge-config';
import { flag } from 'flags/next';
import 'server-only';

import { env } from './env';
import { tryCatch } from './try-catch';

const getConfig = async (id: string) => get(id);

export const aiChatFlag = flag<boolean>({
	key: 'flags.ai-chat',
	async decide() {
		const { data: config, error } = await tryCatch(getConfig('flags.ai-chat'));

		if (!config || error) {
			return env.FLAGS_AI_CHAT === 'true' && !!env.OPENAI_API_KEY;
		}

		return config === 'true' && !!env.OPENAI_API_KEY;
	},
});
