import { test, expect } from 'vitest';

import { withPrefixedUrl } from '.';

test('withPrefixedUrl', () => {
	expect(withPrefixedUrl('/api/v1/login_nonce')).toBe('/api/v1/login_nonce');
	expect(withPrefixedUrl('/api/v1/login_nonce', 'proxy')).toBe('/proxy-api/api/v1/login_nonce');
	expect(withPrefixedUrl('/api/v1/login_nonce', 'self-api')).toBe('/api/v1/login_nonce');
	expect(withPrefixedUrl('api/v1/login_nonce', 'external')).toBe(`https://gateway.chia1104.dev/api/v1/login_nonce`);
});
