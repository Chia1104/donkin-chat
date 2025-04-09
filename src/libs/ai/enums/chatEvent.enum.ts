export const ChatEvent = {
	MessageStart: 'message_start',
	Message: 'message',
	MessageEnd: 'message_end',
	/**
	 * TODO
	 */
	ThinkingStart: 'thinking_start',
	Thinking: 'thinking',
	/**
	 * TODO
	 */
	ThinkingEnd: 'thinking_end',
	FunctionCall: 'function_call',
	FunctionReturn: 'function_return',
	Error: 'error',
	Heartbeat: 'heartbeat',
} as const;

export type ChatEvent = (typeof ChatEvent)[keyof typeof ChatEvent];

export const ChatEventType = {
	Text: 'text',
	System: 'system',
} as const;

export type ChatEventType = (typeof ChatEventType)[keyof typeof ChatEventType];

export const ChatEventStatus = {
	Progressing: 'progressing',
} as const;

export type ChatEventStatus = (typeof ChatEventStatus)[keyof typeof ChatEventStatus];
