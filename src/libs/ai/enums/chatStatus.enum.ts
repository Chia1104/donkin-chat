export const ChatStatus = {
	Idle: 'idle',
	Streaming: 'streaming',
	Error: 'error',
	Success: 'success',
	Searching: 'searching',
} as const;

export type ChatStatus = (typeof ChatStatus)[keyof typeof ChatStatus];
