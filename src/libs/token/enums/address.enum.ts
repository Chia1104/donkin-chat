export const Address = {
	SmartMoney: 'smart-money',
	Whale: 'whale',
} as const;

export type Address = (typeof Address)[keyof typeof Address];
