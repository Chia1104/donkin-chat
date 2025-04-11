import { z } from 'zod';
import type { StateCreator } from 'zustand/vanilla';

import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import type { MessageItem } from '@/libs/ai/types/message';
import { setNamespace } from '@/stores/utils/storeDebug';
import dayjs from '@/utils/dayjs';
import { isAbortError } from '@/utils/is';
import { fetchStream } from '@/utils/request/stream';
import { tryCatch } from '@/utils/try-catch';
import { uuid } from '@/utils/uuid';

import type { ChatStore } from '../../store';

const nameSpace = setNamespace('chat/chat');

export interface ChatAction<TMessageItem extends MessageItem> {
	setInput: (input: string) => void;
	setStatus: (status: ChatStatus) => void;
	pushMessage: (messages: TMessageItem[]) => void;
	deleteMessage: (id: string) => void;
	updateMessage: (id: string, message: Partial<TMessageItem>) => void;
	deleteLastMessage: () => void;
	getMessage: (id: string) => TMessageItem | undefined;
	getLastMessage: () => TMessageItem | undefined;
	updateLastMessageContent: (content: string) => void;
	handleSubmit: (
		content?: string,
		parts?: {
			tools?: TMessageItem['toolCalls'];
		},
	) => void;
	handleRetry: (id: string, handler?: (message: TMessageItem) => void) => void;
	handleCancel: () => void;
	getLatestUserMessage: () => TMessageItem | undefined;

	/**
	 * INTERNAL USE ONLY
	 */
	internal_setStream: (stream: string) => void;
	internal_stream: (messages: TMessageItem[]) => ReturnType<typeof fetchStream>;
	internal_abort: () => void;
	internal_handleSSE: (messages: TMessageItem[]) => void | Promise<void>;
}

export const chatActions: StateCreator<
	ChatStore<MessageItem, unknown, unknown>,
	[['zustand/devtools', never]],
	[],
	ChatAction<MessageItem>
> = (set, get, ctx) => ({
	setInput: (input: string) => {
		set({ input }, false, nameSpace('setInput', input));
	},
	setStatus: (status: ChatStatus) => {
		set({ status }, false, nameSpace('setStatus', status));
	},
	pushMessage: (messages: MessageItem[]) => {
		set({ items: [...get().items, ...messages] }, false, nameSpace('pushMessage', messages));
	},
	deleteMessage: (id: string) => {
		set({ items: get().items.filter(item => item.id !== id) }, false, nameSpace('deleteMessage', id));
	},
	updateLastMessageContent: (content: string) => {
		set(
			{
				items: get().items.map(item =>
					item.id === get().items[get().items.length - 1].id ? { ...item, content } : item,
				),
			},
			false,
			nameSpace('updateLastMessageContent', content),
		);
	},
	updateMessage: (id: string, message: Partial<MessageItem>) => {
		set(
			{ items: get().items.map(item => (item.id === id ? { ...item, ...message } : item)) },
			false,
			nameSpace('updateMessage', id),
		);
	},
	deleteLastMessage: () => {
		set({ items: get().items.slice(0, -1) }, false, nameSpace('deleteLastMessage'));
	},
	getMessage: (id: string) => {
		return get().items.find(item => item.id === id);
	},
	getLastMessage: () => {
		return get().items[get().items.length - 1];
	},
	handleSubmit: (content, parts) => {
		if ((!get().input && !content) || get().status === ChatStatus.Streaming) {
			return;
		}
		const userId = uuid();
		const assistantId = uuid();
		const lastMessage = get().getLastMessage();
		get().pushMessage([
			{
				role: 'user',
				content: content ?? get().input,
				createdAt: dayjs().toDate(),
				id: userId,
				parentId: lastMessage?.id ?? null,
				reasoning: null,
				threadId: get().threadId,
				toolCalls: parts?.tools,
				error: null,
			},
			{
				role: 'assistant',
				content: '',
				createdAt: dayjs().toDate(),
				id: assistantId,
				parentId: userId,
				reasoning: null,
				threadId: get().threadId,
				toolCalls: parts?.tools,
				error: null,
			},
		]);
		set({ status: ChatStatus.Streaming, input: '' }, false, nameSpace('handleSubmit'));

		void get().internal_handleSSE(get().items);
	},
	handleRetry: (id, handler) => {
		const message = get().getMessage(id);
		if (!message) {
			return;
		}
		if (handler) {
			handler(message);
			return;
		}
		void get().updateMessage(id, {
			error: null,
			content: '',
			createdAt: dayjs().toDate(),
		});
		set({ status: ChatStatus.Streaming }, false, nameSpace('handleRetry', id));
		void get().internal_handleSSE(get().items);
	},
	handleCancel: () => {
		set({ status: ChatStatus.Idle }, false, nameSpace('handleCancel'));
		try {
			get().internal_abort();
			void get().onCancel?.({ set, get, ctx });
		} catch (error) {
			console.warn(error);
		}
	},
	getLatestUserMessage: () => {
		return get()
			.items.slice()
			.reverse()
			.find(item => item.role === 'user');
	},

	/**
	 * INTERNAL USE ONLY
	 */
	internal_setStream: (stream: string) => {
		set({ currentStream: stream }, false, nameSpace('internal_setStream', stream));
	},
	/**
	 * INTERNAL USE ONLY
	 */
	internal_stream: async messages => {
		let abortController = get().abortController;
		if (!abortController || abortController.signal.aborted) {
			abortController = new AbortController();
			set({ abortController }, false, nameSpace('internal_stream'));
		}
		const dto = get().streamRequestDTO?.({ set, get, ctx, messages });
		return await fetchStream(get().endpoint, dto ?? { messages, id: get().threadId }, {
			signal: abortController.signal,
			...get().streamRequestInit?.({ set, get, ctx }),
		});
	},
	/**
	 * INTERNAL USE ONLY
	 */
	internal_abort: () => {
		const abortController = get().abortController;
		if (abortController && !abortController.signal.aborted) {
			abortController.abort();
			set({ abortController: undefined }, false, nameSpace('internal_abort'));
		}
	},
	/**
	 * INTERNAL USE ONLY
	 */
	internal_handleSSE: async _messages => {
		const messages = z.array(get().messageSchema).parse(_messages);
		try {
			await get().preStream?.({ set, get, ctx, messages });
			const { data: response, error } = await tryCatch(get().internal_stream(messages));
			if (error) {
				console.error('Error in internal_handleSSE:', error);
				if (isAbortError(error)) {
					console.info('Request was aborted');
					return;
				}
				set({ status: ChatStatus.Error }, false, nameSpace('internal_handleSSE'));
				return;
			}
			await get().messageProcessor({ set, get, ctx, response });
			await get().postStream?.({ set, get, ctx });
		} catch (error) {
			if (isAbortError(error)) {
				console.info('Request was aborted');
				return;
			}
			console.error('Error in internal_handleSSE:', error);
			set({ status: ChatStatus.Error }, false, nameSpace('internal_handleSSE'));
		}
	},
});
