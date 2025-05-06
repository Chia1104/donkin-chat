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

export function formatLargeNumber(
	/**
	 * input number
	 */
	num: number,
	/**
	 * round to decimal places
	 */
	round = 5,
): string {
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

/**
 * @description 將過小的數字轉換成特殊格式，多個小數點後的 0 會用下標數字表示
 * @param {Number} value - 要轉換的數字
 * @param {Number} maxMove - 0 後面的最多數字量(自動做四捨五入) - 預設 5
 * @returns {String} - 轉換後的格式，例如：0.0000174588298474234 --> 0.0₄17459
 */
export function formatSmallNumber(value: number, maxMove = 5): string {
	if (value === 0) {
		return '0';
	}

	if (value >= 1) {
		return roundDecimal(value, maxMove);
	}

	const valueExpStr = value.toExponential();
	const valueParts = valueExpStr.split('e');
	const originalExponent = parseInt(valueParts[1]);
	const originalSubscriptZeros = Math.abs(originalExponent) - 1;

	const subscriptChars = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
	const makeSubscript = (num: number): string => {
		if (num < 0) return ''; // 不應該發生
		return num
			.toString()
			.split('')
			.map(digit => subscriptChars[parseInt(digit)])
			.join('');
	};

	if (originalSubscriptZeros < 2) {
		return value.toFixed(maxMove);
	} else {
		let significantDigits: string;
		let actualSubscriptZeros: number;

		if (maxMove <= 0) {
			significantDigits = '0';
			actualSubscriptZeros = originalSubscriptZeros;
		} else {
			const roundedExpStr = value.toExponential(maxMove - 1);
			const roundedParts = roundedExpStr.split('e');
			const finalMantissaStr = roundedParts[0];
			const finalExponent = parseInt(roundedParts[1]);

			actualSubscriptZeros = Math.abs(finalExponent) - 1;

			let coreDigits = finalMantissaStr.replace('.', '');
			while (coreDigits.length < maxMove) {
				coreDigits += '0';
			}
			significantDigits = coreDigits;
		}

		const subscriptStr = makeSubscript(actualSubscriptZeros);
		return `0.0${subscriptStr}${significantDigits}`;
	}
}
