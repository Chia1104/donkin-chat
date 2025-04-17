import type { StateCreator } from 'zustand/vanilla';

import type { MessageItem } from '@/libs/ai/types/message';
import { setNamespace } from '@/stores/utils/storeDebug';

import type { ChatStore } from '../../store';

const nameSpace = setNamespace('chat/message');

export interface MessageAction<TMessageItem extends MessageItem> {
	pushMessage: (messages: TMessageItem[]) => void;
	deleteMessage: (id: string) => void;
	updateMessage: (id: string, message: Partial<TMessageItem>) => void;
	deleteLastMessage: () => void;
	getMessage: (id: string) => TMessageItem | undefined;
	getLastMessage: () => TMessageItem | undefined;
	updateLastMessageContent: (content: string) => void;
	getLatestUserMessage: () => TMessageItem | undefined;
}

export const messageActions: StateCreator<
	ChatStore<MessageItem, unknown, unknown>,
	[['zustand/devtools', never]],
	[],
	MessageAction<MessageItem>
> = (set, get) => ({
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
	getLatestUserMessage: () => {
		return get()
			.items.slice()
			.reverse()
			.find(item => item.role === 'user');
	},
});
