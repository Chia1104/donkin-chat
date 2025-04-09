import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';

export interface ChatState {
	threadId: string;
	status: ChatStatus;
	input: string;
	enabled: boolean;
	abortController?: AbortController;
}

export const initialChatState: ChatState = {
	status: ChatStatus.Idle,
	input: '',
	threadId: '',
	enabled: true,
};
