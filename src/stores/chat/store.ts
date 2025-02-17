import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import type { ChatStoreState } from './initialState';
import { initialState } from './initialState';
import type { ChatMessageAction } from './slices/message/actions';
import { chatMessage } from './slices/message/actions';

export type ChatStoreAction = ChatMessageAction;

export type ChatStore = ChatStoreAction & ChatStoreState;

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...params) => ({
	...initialState,

	...chatMessage(...params),
});

const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn<ChatStore>()(subscribeWithSelector(devtools(createStore)), shallow);
