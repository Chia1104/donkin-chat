import { initialChatState as _initialChatState } from './slices/chat/initial-state';
import type { ChatState as _ChatState } from './slices/chat/initial-state';
import { initialChatConfig } from './slices/config/initial-state';
import type { ChatConfig } from './slices/config/initial-state';
import { initialMessageState } from './slices/message/initial-state';
import type { MessageState } from './slices/message/initial-state';

export type ChatState = _ChatState & MessageState & ChatConfig;

export const initialChatState: ChatState = {
	..._initialChatState,
	...initialMessageState,
	...initialChatConfig,
};
