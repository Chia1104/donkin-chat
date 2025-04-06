import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import type { MessageItem } from '@/libs/ai/types/message';

import { createDevtools } from '../middleware/create-devtools';
import { initialChatState } from './initial-state';
import type { ChatState } from './initial-state';
import { chatActions } from './slices/chat/actions';
import type { ChatAction } from './slices/chat/actions';

export type ChatStore<TMessageItem extends MessageItem> = ChatState & ChatAction<TMessageItem>;

const devtools = createDevtools('chat.store');

/**
 * TODO: pass generic schema
 */
const createStore: ChatStoreApi = (...params) => ({
	...initialChatState,

	...chatActions(...params),
});

export const useChatStore = createWithEqualityFn<ChatStore<MessageItem>>()(
	subscribeWithSelector(devtools(createStore)),
	shallow,
);

export type ChatStoreApi = StateCreator<
	ChatStore<MessageItem>,
	[['zustand/devtools', never]],
	[],
	ChatStore<MessageItem>
>;
