import type { ChatMessage } from '@/types/message/chat';

export const getMessageById = (messages: ChatMessage[], id: string) => messages.find(m => m.id === id);

export const ChatHelpers = {
	getMessageById,
};
