import type { z } from 'zod';
import type { StateCreator } from 'zustand/vanilla';

import type { MessageItem } from '@/libs/ai/types/message';
import { messageItemSchema } from '@/libs/ai/types/message';
import type { fetchStream } from '@/utils/request/stream';

import type { ChatStore } from '../../store';
import type { ChatAction } from '../chat/actions';

interface BaseContext<TMessageItem extends MessageItem, TStreamRequestDTO = unknown, TContext = unknown> {
	set: Parameters<
		StateCreator<
			ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
			[['zustand/devtools', never]],
			[],
			ChatAction<TMessageItem>
		>
	>[0];
	get: Parameters<
		StateCreator<
			ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
			[['zustand/devtools', never]],
			[],
			ChatAction<TMessageItem>
		>
	>[1];
	ctx: Parameters<
		StateCreator<
			ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
			[['zustand/devtools', never]],
			[],
			ChatAction<TMessageItem>
		>
	>[2];
}

export interface ChatConfig<TMessageItem extends MessageItem, TStreamRequestDTO = unknown, TContext = unknown> {
	endpoint: string;
	messageSchema: z.ZodType<TMessageItem, unknown>;
	messageProcessor: (
		context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
			response: Awaited<ReturnType<typeof fetchStream>>;
		},
	) => void | Promise<void>;
	onCancel?: (context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>) => void | Promise<void>;
	preStream?: (
		context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
			messages: TMessageItem[];
		},
	) => void | Promise<void>;
	postStream?: (context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>) => void | Promise<void>;
	streamRequestInit?: (context: BaseContext<TMessageItem, TStreamRequestDTO, TContext>) => RequestInit & {
		searchParams?: Record<string, string>;
	};
	streamRequestDTO?: (
		context: BaseContext<TMessageItem, TStreamRequestDTO, TContext> & {
			messages: TMessageItem[];
		},
	) => TStreamRequestDTO;
	context?: TContext;
}

export const initialChatConfig: ChatConfig<MessageItem> = {
	endpoint: '/api/chat',
	messageSchema: messageItemSchema,
	messageProcessor: () => {
		throw new Error('Please implement your own messageProcessor');
	},
};
