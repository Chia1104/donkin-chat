import type { MessageRole } from '../enums/messageRole.enum';

export interface ModelReasoning {
	content?: string;
	duration?: number;
}

export interface MessageItem {
	content: string | null;
	createdAt: Date;
	error: any;
	id: string;
	parentId: string | null;
	reasoning: ModelReasoning | null;
	role: MessageRole;
	threadId: string;
	updatedAt: Date | null;
}
