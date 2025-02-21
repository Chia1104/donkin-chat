export interface ModelReasoning {
	content?: string;
	duration?: number;
}

export type MessageRoleType = 'user' | 'system' | 'assistant' | 'tool';

export interface MessageItem {
	content: string | null;
	createdAt: Date;
	error: any;
	id: string;
	parentId: string | null;
	reasoning: ModelReasoning | null;
	role: string;
	threadId: string | null;
	updatedAt: Date;
}

export interface NewMessage {
	content?: string | null;
	createdAt?: Date;
	// optional because it has a default value
	error?: any;
	id?: string;
	parentId?: string | null;
	// optional because it has a default function
	role: 'user' | 'system' | 'assistant' | 'tool';
	threadId: string;
	// optional because it's generated
	updatedAt?: Date;
}
