import { INBOX_SESSION_ID } from '@/consts/session';
import type { ChatMessage } from '@/types/message/chat';

import { ChatHelpers } from '../../helpers';
import type { ChatStoreState } from '../../initialState';

/**
 * Current active raw message list, include thread messages
 */
const activeBaseChats = (s: ChatStoreState): ChatMessage[] => {
	if (!s.activeId) return [];

	const messages = s.messagesMap[s.activeId] ?? [];

	return messages;
};

const mainDisplayChatIDs = (s: ChatStoreState) => activeBaseChats(s).map(s => s.id);

const mainAIChats = (s: ChatStoreState): ChatMessage[] => {
	return activeBaseChats(s);
};

const currentUserMessages = (s: ChatStoreState) => {
	const messages = activeBaseChats(s);

	return messages.filter(m => m.role === 'user');
};

const showInboxWelcome = (s: ChatStoreState): boolean => {
	const isInbox = s.activeId === INBOX_SESSION_ID;
	if (!isInbox) return false;

	const data = activeBaseChats(s);
	return data.length === 0;
};

const getMessageById = (id: string) => (s: ChatStoreState) => ChatHelpers.getMessageById(activeBaseChats(s), id);

const countMessagesByThreadId = (id: string) => (s: ChatStoreState) => {
	const messages = activeBaseChats(s).filter(m => m.threadId === id);

	return messages.length;
};

const latestMessage = (s: ChatStoreState) => activeBaseChats(s).at(-1);

const currentChatLoadingState = (s: ChatStoreState) => !s.messagesInit;

const isCurrentChatLoaded = (s: ChatStoreState) => !!s.messagesMap[s.activeId];

const isMessageEditing = (id: string) => (s: ChatStoreState) => s.messageEditingIds.includes(id);
const isMessageLoading = (id: string) => (s: ChatStoreState) => s.messageLoadingIds.includes(id);

const isMessageGenerating = (id: string) => (s: ChatStoreState) => s.chatLoadingIds.includes(id);

const isAIGenerating = (s: ChatStoreState) => s.chatLoadingIds.some(id => mainDisplayChatIDs(s).includes(id));

const isCreatingMessage = (s: ChatStoreState) => s.isCreatingMessage;

const isHasMessageLoading = (s: ChatStoreState) => s.messageLoadingIds.some(id => mainDisplayChatIDs(s).includes(id));

/**
 * this function is used to determine whether the send button should be disabled
 */
const isSendButtonDisabledByMessage = (s: ChatStoreState) =>
	// 1. when there is message loading
	isHasMessageLoading(s) ||
	// 2. when is creating the message
	isCreatingMessage(s);

export const ChatSelectors = {
	activeBaseChats,
	countMessagesByThreadId,
	currentChatLoadingState,
	currentUserMessages,
	getMessageById,
	isAIGenerating,
	isCreatingMessage,
	isCurrentChatLoaded,
	isHasMessageLoading,
	isMessageEditing,
	isMessageGenerating,
	isMessageLoading,
	isSendButtonDisabledByMessage,
	latestMessage,
	mainAIChats,
	mainDisplayChatIDs,
	showInboxWelcome,
};
