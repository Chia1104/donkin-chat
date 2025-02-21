export const TransactionsFilter = {
	// 0 - 100
	LessThan100: '0-100',
	// > 100
	MoreThan100: '100+',
} as const;

export type TransactionsFilter = (typeof TransactionsFilter)[keyof typeof TransactionsFilter];
