export const FilterColumn = {
	/**
	 * @deprecated
	 */
	Total: 'total',
	/**
	 * 交易金额
	 */
	Transactions: 'transactions',
	/**
	 * @deprecated
	 */
	Favorite: 'favorite',
	/**
	 * 標記聰明錢包
	 */
	Mark: 'mark',
	Interval: 'interval',
	/**
	 * 利潤
	 */
	Profit: 'profit',
	/**
	 * 篩選顯示, e.g. 推荐, 自选
	 */
	Filter: 'filter',
	/**
	 * 聪明钱類型, e.g. 聰明錢, 巨鲸, KOL
	 */
	Type: 'type',
} as const;

export type FilterColumn = (typeof FilterColumn)[keyof typeof FilterColumn];
