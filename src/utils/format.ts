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

export function formatLargeNumber(num: number, round = 5): string {
	// 四捨五入到小數點後 {round} 位
	num = round ? Math.round(num * Math.pow(10, round)) / Math.pow(10, round) : num;

	const formatter = Intl.NumberFormat('en', { notation: 'compact' });

	return formatter.format(num);
}

export function truncateMiddle(
	inputString: string,
	maxLength: number,
	opts?: {
		ellipsis?: string;
		frontLength?: number;
		backLength?: number;
	},
) {
	if (inputString.length <= maxLength) {
		return inputString;
	}

	const ellipsis = opts?.ellipsis ?? '...';
	const frontLength = opts?.frontLength ?? Math.ceil((maxLength - ellipsis.length) / 2);
	const backLength = opts?.backLength ?? Math.floor((maxLength - ellipsis.length) / 2);

	const frontPart = inputString.substring(0, frontLength);
	const backPart = inputString.substring(inputString.length - backLength);

	return frontPart + ellipsis + backPart;
}

export const base64Decode = (base64: string): string => {
	return Buffer.from(base64, 'base64').toString('utf-8');
};

export const base64Encode = (str: string): string => {
	return Buffer.from(str).toString('base64');
};
