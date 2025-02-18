import { test, expect } from 'vitest';

import { formatLargeNumber } from './format';

test('formatLargeNumber', () => {
	expect(formatLargeNumber(1000000)).toBe('1.0m');
	expect(formatLargeNumber(1000)).toBe('1.0k');
	expect(formatLargeNumber(100)).toBe('100');
	expect(formatLargeNumber(1500)).toBe('1.5k');
	expect(formatLargeNumber(2500000)).toBe('2.5m');
	expect(formatLargeNumber(999)).toBe('999');
	expect(formatLargeNumber(100000)).toBe('100.0k');
	expect(formatLargeNumber(0.0039214)).toBe('0.0039214');
});
