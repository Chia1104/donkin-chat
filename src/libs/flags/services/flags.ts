import { get } from '@vercel/edge-config';
import { flag } from 'flags/next';
import 'server-only';

export const getConfig = async (id: string) => get(id);

export const FlagID = {
	AIChat: 'flags-ai-chat',
} as const;

export const aiChatFlag = flag<boolean>({
	key: FlagID.AIChat,
	decide() {
		return true;
	},
});
