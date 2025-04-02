import type { MessageItemSchema } from '@/libs/ai/types/message';
import { messageItemSchema } from '@/libs/ai/types/message';

export interface ChatConfig {
	endpoint: string;
	messageSchema: MessageItemSchema;
}

export const initialChatConfig: ChatConfig = {
	endpoint: '/api/chat',
	messageSchema: messageItemSchema,
};
