/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import type { StateCreator } from 'zustand/vanilla';

import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import type { MessageItem } from '@/libs/ai/types/message';
import { setNamespace } from '@/stores/utils/storeDebug';
import { fetchEventSource } from '@/utils/request/fetchEventSource';
import { fetchStream } from '@/utils/request/stream';

import type { ChatStore } from '../../store';

const nameSpace = setNamespace('chat/chat');

export interface ChatAction<TMessageItem extends MessageItem> {
	setInput: (input: string) => void;
	submit: () => void;

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
> = (set, get) => ({
	setInput: (input: string) => {
		set({ input }, false, nameSpace('setInput', input));
	},
	submit: () => {
		const current = get().input;
		const validated = z.string().min(1).safeParse(current);
		if (!validated.success) {
			return;
		}
		set({ status: ChatStatus.Pending }, false, nameSpace('submit'));
	},

	/**
	 * INTERNAL USE ONLY
	 */
	internal_setStream: (stream: string) => {
		set({ currentStream: stream }, false, nameSpace('internal_setStream', stream));
	},
	internal_handleSSE: async _messages => {
		const messages = z.array(get().messageSchema).parse(_messages);
		const response = await fetchStream(get().endpoint, { messages, id: 'test' });
		for await (const chunk of response) {
			console.log('chunk', chunk);
		}
		// await fetchEventSource(get().endpoint, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({ messages, id: 'test' }),
		// 	onopen: response => {
		// 		console.log('onopen', response);
		// 	},
		// 	onmessage: event => {
		// 		console.log('onmessage', event);
		// 	},
		// 	onclose: () => {
		// 		console.log('onclose');
		// 	},
		// 	onerror: error => {
		// 		console.log('onerror', error);
		// 	},
		// });
	},
});
