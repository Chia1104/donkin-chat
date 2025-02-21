import type { ErrorType } from '@/types/fetch';
import type { MessageRoleType, ModelReasoning } from '@/types/message/base';

export interface ChatMessageError {
	body?: any;
	message: string;
	type: ErrorType;
}

export interface ChatTTS {
	contentMd5?: string;
	file?: string;
	voice?: string;
}

export interface ChatFileItem {
	fileType: string;
	id: string;
	name: string;
	size: number;
	url: string;
}

export interface ChatImageItem {
	alt: string;
	id: string;
	url: string;
}

export interface ChatFileChunk {
	fileId: string;
	fileType: string;
	fileUrl: string;
	filename: string;
	id: string;
	similarity?: number;
	text: string;
}

export interface ChatMessage {
	chunksList?: ChatFileChunk[];
	content: string;
	createdAt: number;

	fileList?: ChatFileItem[];

	id: string;
	imageList?: ChatImageItem[];
	/**
	 * parent message id
	 */
	parentId?: string;

	reasoning?: ModelReasoning | null;

	/**
	 * message role type
	 */
	role: MessageRoleType;
	threadId?: string | null;
	updatedAt: number;
}

export interface CreateMessageParams extends Partial<Omit<ChatMessage, 'content' | 'role' | 'topicId' | 'chunksList'>> {
	content: string;
	error?: ChatMessageError | null;
	role: MessageRoleType;
	threadId?: string | null;
}
