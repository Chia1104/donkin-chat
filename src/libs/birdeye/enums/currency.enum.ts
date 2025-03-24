export const Currency = {
	USD: 'usd',
	Native: 'native',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];
