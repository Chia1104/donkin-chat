export const ProfitFilter = {
	'5%': 0,
	'25%': 2.5,
	'50%': 5,
	'75%': 7.5,
	'100%': 10,
} as const;

export const ProfitLiteral = [
	ProfitFilter['5%'],
	ProfitFilter['25%'],
	ProfitFilter['50%'],
	ProfitFilter['75%'],
	ProfitFilter['100%'],
] as const;

export type ProfitFilter = (typeof ProfitFilter)[keyof typeof ProfitFilter];
