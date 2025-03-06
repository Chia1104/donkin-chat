export const TransactionsFilter = {
	'5K': 0,
	'25K': 2.5,
	'50K': 5.0,
	'75K': 7.5,
	'100K': 10.0,
} as const;

export const TransactionsLiteral = [
	TransactionsFilter['5K'],
	TransactionsFilter['25K'],
	TransactionsFilter['50K'],
	TransactionsFilter['75K'],
	TransactionsFilter['100K'],
] as const;

export type TransactionsFilter = (typeof TransactionsFilter)[keyof typeof TransactionsFilter];
