'use client';

import type { ReactNode } from 'react';
import { createContext, use, useRef } from 'react';

import { useStore } from 'zustand';
import type { StateCreator, StoreApi } from 'zustand/vanilla';
import { createStore } from 'zustand/vanilla';

import type { MessageItem } from '@/libs/ai/types/message';

import { createDevtools } from '../middleware/create-devtools';
import { initialChatState } from './initial-state';
import type { ChatState } from './initial-state';
import { chatActions } from './slices/chat/actions';
import type { ChatAction } from './slices/chat/actions';
import { messageActions } from './slices/message/actions';
import type { MessageAction } from './slices/message/actions';

export type ChatStore<TMessageItem extends MessageItem, TStreamRequestDTO, TContext> = ChatState<
	TMessageItem,
	TStreamRequestDTO,
	TContext
> &
	ChatAction<TMessageItem> &
	MessageAction<TMessageItem>;

export type ChatStoreApi<TMessageItem extends MessageItem, TStreamRequestDTO, TContext> = StateCreator<
	ChatStore<TMessageItem, TStreamRequestDTO, TContext>,
	[['zustand/devtools', never]],
	[],
	ChatStore<TMessageItem, TStreamRequestDTO, TContext>
>;

export interface ChatStoreProviderProps<TMessageItem extends MessageItem, TStreamRequestDTO, TContext> {
	children: ReactNode;
	values?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>;
}

export interface DefineChatStoreProps<TMessageItem extends MessageItem, TStreamRequestDTO, TContext> {
	initState?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>;
	messageProcessor: ChatStore<TMessageItem, TStreamRequestDTO, TContext>['messageProcessor'];
	enableDevtools?: boolean;
}

const devtools = createDevtools('chat.store');

const createChatStore =
	<TMessageItem extends MessageItem, TStreamRequestDTO = unknown, TContext = unknown>(
		initState?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>,
	): ChatStoreApi<TMessageItem, TStreamRequestDTO, TContext> =>
	(...params) =>
		({
			...initialChatState,

			...initState,

			// @ts-expect-error - fix actions generic type
			...chatActions(...params),

			// @ts-expect-error - fix actions generic type
			...messageActions(...params),
		}) as ChatStore<TMessageItem, TStreamRequestDTO, TContext>;

export const defineChatStore = <TMessageItem extends MessageItem, TStreamRequestDTO, TContext>({
	initState,
	messageProcessor,
	enableDevtools,
}: DefineChatStoreProps<TMessageItem, TStreamRequestDTO, TContext>) => {
	const creator = (state?: Partial<ChatState<TMessageItem, TStreamRequestDTO, TContext>>) => {
		const _state = Object.assign({ ...initState }, state, { messageProcessor });
		return createStore<ChatStore<TMessageItem, TStreamRequestDTO, TContext>, [['zustand/devtools', never]]>(
			devtools(createChatStore<TMessageItem, TStreamRequestDTO, TContext>(_state), {
				enabled: enableDevtools,
			}),
		);
	};

	const ChatStoreContext = createContext<StoreApi<ChatStore<TMessageItem, TStreamRequestDTO, TContext>> | undefined>(
		undefined,
	);

	const ChatStoreProvider = ({
		children,
		values,
	}: ChatStoreProviderProps<TMessageItem, TStreamRequestDTO, TContext>) => {
		const storeRef = useRef<StoreApi<ChatStore<TMessageItem, TStreamRequestDTO, TContext>>>(null);
		if (!storeRef.current) {
			storeRef.current = creator(values);
		}

		return <ChatStoreContext value={storeRef.current}>{children}</ChatStoreContext>;
	};

	const useChatStore = <T,>(
		selector: (store: ChatStore<TMessageItem, TStreamRequestDTO, TContext>) => T,
		name = 'useChatStore',
	): T => {
		const chatStoreContext = use(ChatStoreContext);
		if (!chatStoreContext) {
			throw new Error(`${name} must be used within ChatStoreProvider`);
		}

		return useStore(chatStoreContext, selector);
	};

	return { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
};
