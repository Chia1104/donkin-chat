export const FilterColumn = {
	Total: 'total',
	Transactions: 'transactions',
	Favorite: 'favorite',
	Mark: 'mark',
} as const;

export type FilterColumn = (typeof FilterColumn)[keyof typeof FilterColumn];
