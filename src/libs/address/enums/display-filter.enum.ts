export const DisplayFilter = {
	BalanceHistory: 'b',
	ProfitLoss: 'p',
} as const;

export type DisplayFilter = (typeof DisplayFilter)[keyof typeof DisplayFilter];
