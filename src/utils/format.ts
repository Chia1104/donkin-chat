/**
 * @description 四捨五入至小數點, 並加上千分位
 * @param {Number} value - 要四捨五入的數字
 * @param {Number} decimal - 小數點位數
 * @param intlOptions - i18n 設定
 * @returns {String}
 */
export const roundDecimal = (
	value: number,
	decimal = 0,
	intlOptions?: {
		locales?: Intl.LocalesArgument;
		options?: Intl.NumberFormatOptions;
	},
) => {
	const { locales = 'en-US', options } = intlOptions ?? {};
	const { style = 'decimal', ...rest } = options ?? {};
	return (Math.round(Math.round(value * Math.pow(10, decimal + 1)) / 10) / Math.pow(10, decimal)).toLocaleString(
		locales,
		{
			style,
			...rest,
		},
	);
};
