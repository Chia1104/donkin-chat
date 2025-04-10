import type { MessageItem } from '@/libs/ai/types/message';

import { initialChatState as _initialChatState } from './slices/chat/initial-state';
import type { ChatState as _ChatState } from './slices/chat/initial-state';
import { initialChatConfig } from './slices/config/initial-state';
import type { ChatConfig } from './slices/config/initial-state';
import { initialMessageState } from './slices/message/initial-state';
import type { MessageState } from './slices/message/initial-state';

export type ChatState<TMessageItem extends MessageItem, TStreamRequestDTO = unknown, TContext = unknown> = _ChatState &
	MessageState<TMessageItem> &
	ChatConfig<TMessageItem, TStreamRequestDTO, TContext>;

export const initialChatState: ChatState<MessageItem> = {
	..._initialChatState,
	...initialMessageState,
	...initialChatConfig,
};
