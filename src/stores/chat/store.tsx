'use client';

import type { ReactNode } from 'react';
import { createContext, use, useRef } from 'react';

import type { z } from 'zod';
import { useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator, StoreApi } from 'zustand/vanilla';
import { createStore } from 'zustand/vanilla';

import { messageItemSchema } from '@/libs/ai/types/message';
import type { MessageItem } from '@/libs/ai/types/message';

import { createDevtools } from '../middleware/create-devtools';
import { initialChatState } from './initial-state';
import type { ChatState } from './initial-state';
import { chatActions } from './slices/chat/actions';
import type { ChatAction } from './slices/chat/actions';

export type ChatStore<TMessageItem extends MessageItem> = ChatState<TMessageItem> & ChatAction<TMessageItem>;

export type ChatStoreApi<TMessageItem extends MessageItem> = StateCreator<
	ChatStore<TMessageItem>,
	[['zustand/devtools', never]],
	[],
	ChatStore<TMessageItem>
>;

export interface ChatStoreProviderProps<TMessageItem extends MessageItem> {
	children: ReactNode;
	values?: Partial<ChatState<TMessageItem>>;
}

const devtools = createDevtools('chat.store');

const createChatStore =
	<TMessageItem extends MessageItem>(initState?: Partial<ChatState<TMessageItem>>): ChatStoreApi<TMessageItem> =>
	(...params) =>
		({
			...initialChatState,

			...initState,

			// @ts-expect-error - fix actions generic type
			...chatActions(...params),
		}) as ChatStore<TMessageItem>;

/**
 * @deprecated use `useChatStore` from `defineChatStore` instead
 */
export const legacy_useChatStore = createWithEqualityFn<ChatStore<MessageItem>>()(
	subscribeWithSelector(devtools(createChatStore)),
	shallow,
);

export const defineChatStore = <TMessageItem extends MessageItem>(initState?: Partial<ChatState<TMessageItem>>) => {
	const creator = (state?: Partial<ChatState<TMessageItem>>) => {
		const _state = Object.assign({ ...initState }, state);
		return createStore<ChatStore<TMessageItem>, [['zustand/devtools', never]]>(
			devtools(createChatStore<TMessageItem>(_state)),
		);
	};

	const ChatStoreContext = createContext<StoreApi<ChatStore<TMessageItem>> | undefined>(undefined);

	const ChatStoreProvider = ({ children, values }: ChatStoreProviderProps<TMessageItem>) => {
		const storeRef = useRef<StoreApi<ChatStore<TMessageItem>>>(null);
		if (!storeRef.current) {
			storeRef.current = creator(values);
		}

		return <ChatStoreContext value={storeRef.current}>{children}</ChatStoreContext>;
	};

	const useChatStore = <T,>(selector: (store: ChatStore<TMessageItem>) => T): T => {
		const chatStoreContext = use(ChatStoreContext);
		if (!chatStoreContext) {
			throw new Error(`useChatStore must be used within ChatStoreProvider`);
		}

		return useStore(chatStoreContext, selector);
	};

	return { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
};

const messageItemSchemaWithContext = messageItemSchema.transform(item => ({
	...item,
	context: {
		foo: 'bar' as const,
	},
}));

type MessageItemWithContext = z.infer<typeof messageItemSchemaWithContext>;

const { ChatStoreProvider, useChatStore, ChatStoreContext, creator } = defineChatStore<MessageItemWithContext>({
	messageSchema: messageItemSchemaWithContext,
});

export { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
