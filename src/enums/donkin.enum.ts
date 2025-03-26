export const DonkinStatus = {
	Open: 'open',
	Close: 'close',
	Thinking: 'thinking',
} as const;

export type DonkinStatus = (typeof DonkinStatus)[keyof typeof DonkinStatus];
