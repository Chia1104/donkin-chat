import { z } from 'zod';

import { MessageRole } from '../enums/messageRole.enum';

export const modelReasoningSchema = z.object({
	content: z.string().optional(),
	duration: z.number().optional(),
});

export type ModelReasoning = z.infer<typeof modelReasoningSchema>;

export const toolCallSchema = z.object({
	id: z.string(),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
});

export const messageItemSchema = z.object({
	content: z.string().nullable(),
	createdAt: z.date(),
	error: z.any().nullable(),
	id: z.string(),
	parentId: z.string().nullable(),
	reasoning: modelReasoningSchema.nullable(),
	role: z.enum(MessageRole),
	threadId: z.string(),
	toolCalls: z.array(toolCallSchema).optional(),
});

/**
 * extendable schema
 */
export type MessageItemSchema = z.ZodType<MessageItem>;

export type MessageItem = z.infer<typeof messageItemSchema>;
