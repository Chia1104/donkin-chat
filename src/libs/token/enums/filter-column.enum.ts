export const FilterColumn = {
	Total: 'total',
	Transactions: 'transactions',
	Favorite: 'favorite',
	Mark: 'mark',
	Interval: 'interval',
} as const;

export type FilterColumn = (typeof FilterColumn)[keyof typeof FilterColumn];
