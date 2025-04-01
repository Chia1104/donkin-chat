export const DonkinStatus = {
	Open: 'open',
	Close: 'close',
	Thinking: 'thinking',
	Folded: 'folded',
} as const;

export type DonkinStatus = (typeof DonkinStatus)[keyof typeof DonkinStatus];
