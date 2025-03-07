import { test, expect } from 'vitest';

import { withPrefixedUrl } from '.';

test('withPrefixedUrl', () => {
	expect(withPrefixedUrl('/api/v1/login_nonce')).toBe('/api/v1/login_nonce');
	expect(withPrefixedUrl('/api/v1/login_nonce', 'proxy')).toBe('/proxy-api/api/v1/login_nonce');
	expect(withPrefixedUrl('/api/v1/login_nonce', 'self-api')).toBe('/api/v1/login_nonce');
	expect(withPrefixedUrl('api/v1/login_nonce', 'external')).toBe(`http://18.190.207.151:8082/api/v1/login_nonce`);
});
