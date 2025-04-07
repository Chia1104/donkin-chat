import { z } from 'zod';
import type { StateCreator } from 'zustand/vanilla';

import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import type { MessageItem } from '@/libs/ai/types/message';
import { setNamespace } from '@/stores/utils/storeDebug';
import dayjs from '@/utils/dayjs';
import { fetchStream } from '@/utils/request/stream';
import { uuid } from '@/utils/uuid';

import type { ChatStore } from '../../store';

const nameSpace = setNamespace('chat/chat');

export interface ChatAction<TMessageItem extends MessageItem> {
	setInput: (input: string) => void;
	submit: () => void;
	setStatus: (status: ChatStatus) => void;
	pushMessage: (messages: TMessageItem[]) => void;
	deleteMessage: (id: string) => void;
	updateMessage: (id: string, message: Partial<TMessageItem>) => void;
	deleteLastMessage: () => void;
	getMessage: (id: string) => TMessageItem | undefined;
	getLastMessage: () => TMessageItem | undefined;
	updateLastMessageContent: (content: string) => void;
	handleSubmit: (content?: string, parts?: unknown[]) => void;
	handleRetry: (id: string, handler?: (message: TMessageItem) => void) => void;

	/**
	 * INTERNAL USE ONLY
	 */
	internal_setStream: (stream: string) => void;
	internal_handleSSE: (messages: TMessageItem[]) => void | Promise<void>;
}

export const chatActions: StateCreator<
	ChatStore<MessageItem>,
	[['zustand/devtools', never]],
	[],
	ChatAction<MessageItem>
> = (set, get, ctx) => ({
	setInput: (input: string) => {
		set({ input }, false, nameSpace('setInput', input));
	},
	submit: () => {
		const current = get().input;
		const validated = z.string().min(1).safeParse(current);
		if (!validated.success) {
			return;
		}
		set({ status: ChatStatus.Streaming }, false, nameSpace('submit'));
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
	handleSubmit: content => {
		if (!get().input && !content) {
			return;
		}
		const userId = uuid();
		const assistantId = uuid();
		get().pushMessage([
			{
				role: 'user',
				content: content ?? get().input,
				createdAt: dayjs().toDate(),
				id: userId,
				parentId: null,
				reasoning: null,
				threadId: get().threadId,
			},
			{
				role: 'assistant',
				content: '',
				createdAt: dayjs().toDate(),
				id: assistantId,
				parentId: userId,
				reasoning: null,
				threadId: get().threadId,
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

	/**
	 * INTERNAL USE ONLY
	 */
	internal_setStream: (stream: string) => {
		set({ currentStream: stream }, false, nameSpace('internal_setStream', stream));
	},
	/**
	 * INTERNAL USE ONLY
	 */
	internal_handleSSE: async _messages => {
		const messages = z.array(get().messageSchema).parse(_messages);
		const response = await fetchStream(get().endpoint, { messages, id: get().threadId });
		await get().messageProcessor({ set, get, ctx, response });
	},
});
