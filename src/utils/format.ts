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

export function formatLargeNumber(num: number): string {
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1) + 'm'; // 轉換為百萬，保留一位小數
	} else if (num >= 1_000) {
		return (num / 1_000).toFixed(1) + 'k'; // 轉換為千，保留一位小數
	} else {
		return num.toString(); // 小於千的數字直接返回
	}
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
