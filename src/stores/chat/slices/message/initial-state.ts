import type { MessageItem } from '@/libs/ai/types/message';

export interface MessageState {
	items: MessageItem[];
	currentStream: string | null;
}

export const initialMessageState: MessageState = {
	items: [],
	currentStream: null,
};
