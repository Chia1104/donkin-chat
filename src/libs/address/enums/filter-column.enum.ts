export const FilterColumn = {
	/**
	 * 圖表顯示模式，e.g. 馀额历史, 每日盈亏
	 */
	Display: 'display',
	/**
	 * 時間間隔，e.g. 1W, 30D
	 */
	Interval: 'interval',
} as const;

export type FilterColumn = (typeof FilterColumn)[keyof typeof FilterColumn];
