import type { ChatMessage } from '@/types/message/chat';

export interface ChatMessageState {
	/**
	 * @title 當前活動的對話
	 * @description 當前正在編輯或查看的對話
	 */
	activeId: string;

	isCreatingMessage: boolean;
	/**
	 * is the message is editing
	 */
	messageEditingIds: string[];
	/**
	 * is the message is creating or updating in the service
	 */
	messageLoadingIds: string[];
	/**
	 * whether messages have fetched
	 */
	messagesInit: boolean;
	messagesMap: Record<string, ChatMessage[]>;
}

export const initialMessageState: ChatMessageState = {
	activeId: 'inbox',
	isCreatingMessage: false,
	messageEditingIds: [],
	messageLoadingIds: [],
	messagesInit: false,
	messagesMap: {},
};
