import type { z } from 'zod';
import type { StateCreator } from 'zustand/vanilla';

import type { MessageItem } from '@/libs/ai/types/message';
import { messageItemSchema } from '@/libs/ai/types/message';
import type { fetchStream } from '@/utils/request/stream';

import type { ChatStore } from '../../store';
import type { ChatAction } from '../chat/actions';

export interface ChatConfig<TMessageItem extends MessageItem> {
	endpoint: string;
	messageSchema: z.ZodType<TMessageItem, any, any>;
	messageProcessor: ({
		set,
		get,
		ctx,
		response,
	}: {
		set: Parameters<
			StateCreator<ChatStore<TMessageItem>, [['zustand/devtools', never]], [], ChatAction<TMessageItem>>
		>[0];
		get: Parameters<
			StateCreator<ChatStore<TMessageItem>, [['zustand/devtools', never]], [], ChatAction<TMessageItem>>
		>[1];
		ctx: Parameters<
			StateCreator<ChatStore<TMessageItem>, [['zustand/devtools', never]], [], ChatAction<TMessageItem>>
		>[2];
		response: Awaited<ReturnType<typeof fetchStream>>;
	}) => void | Promise<void>;
}

export const initialChatConfig: ChatConfig<MessageItem> = {
	endpoint: '/api/chat',
	messageSchema: messageItemSchema,
	messageProcessor: () => {
		throw new Error('Please implement your own messageProcessor');
	},
};
