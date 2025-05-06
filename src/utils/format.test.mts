import { describe, expect, it } from 'vitest';

import { base64Decode, base64Encode, formatSmallNumber } from './format';

describe('base64Decode', () => {
	it('should decode a base64 string', () => {
		const decoded = base64Decode('SGVsbG8gV29ybGQh');
		expect(decoded).toBe('Hello World!');
	});
});

describe('base64Encode', () => {
	it('should encode a string', () => {
		const encoded = base64Encode('Hello World!');
		expect(encoded).toBe('SGVsbG8gV29ybGQh');
	});
});

describe('formatSmallNumber', () => {
	it('should be 0.0₈10000', () => {
		const formatted = formatSmallNumber(0.000000001);
		expect(formatted).toBe('0.0₈10000');
	});

	it('should be 0.0₈49357', () => {
		const formatted = formatSmallNumber(0.0000000049356984056);
		expect(formatted).toBe('0.0₈49357');
	});

	it('should be 0.0₆235', () => {
		const formatted = formatSmallNumber(0.000000234585, 3);
		expect(formatted).toBe('0.0₆235');
	});

	it('should be 0.0₆234', () => {
		const formatted = formatSmallNumber(0.000000234385, 3);
		expect(formatted).toBe('0.0₆234');
	});

	it('should be 0.0₆200', () => {
		const formatted = formatSmallNumber(0.0000002, 3);
		expect(formatted).toBe('0.0₆200');
	});

	it('should be 0.023', () => {
		const formatted = formatSmallNumber(0.0234, 3);
		expect(formatted).toBe('0.023');
	});

	it('should be 0.024', () => {
		const formatted = formatSmallNumber(0.0237, 3);
		expect(formatted).toBe('0.024');
	});

	it('should be 0.240', () => {
		const formatted = formatSmallNumber(0.24, 3);
		expect(formatted).toBe('0.240');
	});

	/**
	 * TODO: 需要修正小數位數
	 */
	it('should be 11.322', () => {
		const formatted = formatSmallNumber(11.3223332, 4);
		expect(formatted).toBe('11.322');
	});
});
