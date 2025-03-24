export const MessageRole = {
	Assistant: 'assistant',
	System: 'system',
	Tool: 'tool',
	User: 'user',
} as const;

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];
