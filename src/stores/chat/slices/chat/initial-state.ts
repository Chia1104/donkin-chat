import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';

export interface ChatState {
	threadId: string;
	status: ChatStatus;
	input: string;
	enabled: boolean;
}

export const initialChatState: ChatState = {
	status: ChatStatus.Idle,
	input: '',
	threadId: '',
	enabled: false,
};
