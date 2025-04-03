'use client';

import { createContext, useRef, use } from 'react';
import type { ReactNode } from 'react';

import { useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

export interface ChatState {
	chatId: string;
	enabled: boolean;
	/**
	 * TODO: define preview schema
	 */
	preview: any;
}

export interface ChatActions {
	updatePreview: (preview: any) => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
	chatId: '',
	enabled: false,
	preview: null,
};

export const createChatStore = (initState?: Partial<ChatState>) => {
	const state = Object.assign({ ...defaultInitState }, initState);
	return createStore<ChatStore>()(
		immer(set => ({
			...state,
			updatePreview: (preview: any) => set(state => (state.preview = preview)),
		})),
	);
};

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(undefined);

export interface ChatStoreProviderProps {
	children: ReactNode;
	values?: Partial<ChatState>;
}

export const ChatStoreProvider = ({ children, values }: ChatStoreProviderProps) => {
	const storeRef = useRef<ChatStoreApi>(null);
	if (!storeRef.current) {
		storeRef.current = createChatStore(values);
	}

	return <ChatStoreContext value={storeRef.current}>{children}</ChatStoreContext>;
};

/**
 * @deprecated use `useChatStore` in `@/stores/chat/store` instead
 */
export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
	const chatStoreContext = use(ChatStoreContext);

	if (!chatStoreContext) {
		throw new Error(`useChatStore must be used within ChatStoreProvider`);
	}

	return useStore(chatStoreContext, selector);
};
