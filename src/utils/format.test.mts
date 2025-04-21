import { describe, expect, it } from 'vitest';

import { base64Decode, base64Encode } from './format';

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
