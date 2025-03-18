export const FilterColumn = {
	/**
	 * 標記聰明錢包
	 */
	Mark: 'mark',
	Interval: 'interval',
	/**
	 * 交易地址, e.g. 聰明錢, 巨鲸
	 */
	Address: 'address',
	/**
	 * 喊單類型, e.g. KOL
	 */
	Order: 'order',
	/**
	 * 交易金额最小值
	 */
	TransactionMin: 'tmin',
	/**
	 * 交易金额最大值
	 */
	TransactionMax: 'tmax',
	/**
	 * 喊單數量最小值
	 */
	OrderCountMin: 'ocmin',
	/**
	 * 喊單數量最大值
	 */
	OrderCountMax: 'ocmax',
} as const;

export type FilterColumn = (typeof FilterColumn)[keyof typeof FilterColumn];
