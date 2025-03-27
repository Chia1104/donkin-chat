export const ChatStatus = {
	Idle: 'idle',
	Pending: 'pending',
	Error: 'error',
	Success: 'success',
} as const;

export type ChatStatus = (typeof ChatStatus)[keyof typeof ChatStatus];
