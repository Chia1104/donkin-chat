import { z } from 'zod';

import { MessageRole } from '../enums/messageRole.enum';

export const modelReasoningSchema = z.object({
	content: z.string().optional(),
	duration: z.number().optional(),
});

export type ModelReasoning = z.infer<typeof modelReasoningSchema>;

export const messageItemSchema = z.object({
	content: z.string().nullable(),
	createdAt: z.date(),
	error: z.any().nullable(),
	id: z.string(),
	parentId: z.string().nullable(),
	reasoning: modelReasoningSchema.nullable(),
	role: z.nativeEnum(MessageRole),
	threadId: z.string(),
});

/**
 * extendable schema
 */
export type MessageItemSchema = z.ZodType<MessageItem>;

export type MessageItem = z.infer<typeof messageItemSchema>;
