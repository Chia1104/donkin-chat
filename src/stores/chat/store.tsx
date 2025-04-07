'use client';

import type { ReactNode } from 'react';
import { createContext, use, useRef } from 'react';

import { processDataStream } from 'ai';
import { useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator, StoreApi } from 'zustand/vanilla';
import { createStore } from 'zustand/vanilla';

import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
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

export interface DefineChatStoreProps<TMessageItem extends MessageItem> {
	initState?: Partial<ChatState<TMessageItem>>;
	messageProcessor: ChatStore<TMessageItem>['messageProcessor'];
	enableDevtools?: boolean;
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

export const defineChatStore = <TMessageItem extends MessageItem>({
	initState,
	messageProcessor,
	enableDevtools,
}: DefineChatStoreProps<TMessageItem>) => {
	const creator = (state?: Partial<ChatState<TMessageItem>>) => {
		const _state = Object.assign({ ...initState }, state, { messageProcessor });
		return createStore<ChatStore<TMessageItem>, [['zustand/devtools', never]]>(
			devtools(createChatStore<TMessageItem>(_state), {
				enabled: enableDevtools,
			}),
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

const { ChatStoreProvider, useChatStore, ChatStoreContext, creator } = defineChatStore({
	async messageProcessor({ get, response }) {
		let text = '';
		await processDataStream({
			stream: response.stream,
			onTextPart: part => {
				text += part;
				get().internal_setStream(text);
				get().updateLastMessageContent(text);
			},
			onErrorPart: error => {
				get().setStatus(ChatStatus.Error);
				const lastMessage = get().getLastMessage();
				if (lastMessage) {
					get().updateMessage(lastMessage.id, {
						error,
					});
				}
			},
			onFinishStepPart: () => {
				get().setStatus(ChatStatus.Success);
			},
			onStartStepPart: () => {
				get().setStatus(ChatStatus.Streaming);
			},
		});
	},
	initState: {
		messageSchema: messageItemSchemaWithContext,
	},
});

export { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
