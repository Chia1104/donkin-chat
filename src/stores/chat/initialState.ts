import type { ChatAIChatState } from './slices/aiChat/initialState';
import { initialAiChatState } from './slices/aiChat/initialState';
import type { ChatMessageState } from './slices/message/initialState';
import { initialMessageState } from './slices/message/initialState';

export type ChatStoreState = ChatMessageState & ChatAIChatState;

export const initialState: ChatStoreState = {
	...initialMessageState,
	...initialAiChatState,
};
