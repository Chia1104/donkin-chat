import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';

export interface ChatState {
	status: ChatStatus;
	input: string;
}

export const initialChatState: ChatState = {
	status: ChatStatus.Idle,
	input: '',
};
