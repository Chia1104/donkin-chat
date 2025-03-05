export const TypeFilter = {
	SmartMoney: 'smart-money',
	Whale: 'whale',
	Kol: 'kol',
} as const;

export type TypeFilter = (typeof TypeFilter)[keyof typeof TypeFilter];
