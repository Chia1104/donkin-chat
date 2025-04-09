import { z } from 'zod';

import { ChatEventType } from '../enums/chatEvent.enum';

export const messageStartSchema = z.object({
	type: z.literal(ChatEventType.System),
	conv_id: z.string(),
	msg_id: z.string(),
});

export type MessageStart = z.infer<typeof messageStartSchema>;

export const messageSchema = z.object({
	type: z.literal(ChatEventType.Text),
	content: z.string(),
	sequence: z.number(),
});

export type Message = z.infer<typeof messageSchema>;

export const thinkingSchema = z.object({
	type: z.literal(ChatEventType.Text),
	status: z.unknown(),
	content: z.string(),
	sequence: z.number(),
});

export type Thinking = z.infer<typeof thinkingSchema>;

export const heartbeatSchema = z.object({
	type: z.literal(ChatEventType.System),
});

export type Heartbeat = z.infer<typeof heartbeatSchema>;

export const errorSchema = z.unknown();

export type Error = z.infer<typeof errorSchema>;

export const messageEndSchema = z.object({
	type: z.literal(ChatEventType.System),
	conv_id: z.string(),
	msg_id: z.string(),
	content: z.string(),
});

export type MessageEnd = z.infer<typeof messageEndSchema>;
