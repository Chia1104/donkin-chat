export const Order = {
	KOL: 'KOL',
} as const;

export type Order = (typeof Order)[keyof typeof Order];
