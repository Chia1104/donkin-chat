import ky from 'ky';
import type { Options } from 'ky';

import { env } from '../env';

type RequestOptions = {
	requestMode?: RequestMode;
} & Options;

export type RequestMode =
	| 'proxy'
	| 'self-api'
	| 'external'
	| 'ai'
	| 'proxy-ai'
	| 'node-endpoint'
	| 'proxy-invitations-api'
	| 'invitations-api';

const getPrefixedUrl = (requestMode?: RequestMode) => {
	const IS_SERVER = typeof window === 'undefined';
	switch (requestMode) {
		case 'proxy':
			return !IS_SERVER ? '/proxy-api' : env.NEXT_PUBLIC_APP_API_HOST;
		case 'self-api':
			return !IS_SERVER ? '/' : env.NEXT_PUBLIC_APP_API_HOST;
		case 'external':
			return env.NEXT_PUBLIC_APP_API_HOST;
		case 'ai':
			return env.NEXT_PUBLIC_APP_AI_API_HOST;
		case 'proxy-ai':
			return !IS_SERVER ? '/proxy-ai-api' : env.NEXT_PUBLIC_APP_AI_API_HOST;
		case 'node-endpoint':
			return env.NEXT_PUBLIC_APP_NODE_ENDPOINT ?? '/';
		case 'proxy-invitations-api':
			return !IS_SERVER ? '/proxy-invitations-api' : env.NEXT_PUBLIC_APP_INVITATIONS_API_HOST;
		case 'invitations-api':
			return env.NEXT_PUBLIC_APP_INVITATIONS_API_HOST;
		default:
			return !IS_SERVER ? '/' : env.NEXT_PUBLIC_APP_API_HOST;
	}
};

export const withPrefixedUrl = (url: string, requestMode?: RequestMode) => {
	// remove trailing slash
	const prefixedUrl = getPrefixedUrl(requestMode).replace(/\/$/, '');
	// remove leading slash
	const _url = url.replace(/^\//, '');
	return `${prefixedUrl}/${_url}`;
};

export const request = (defaultOptions?: RequestOptions) => {
	const { requestMode = 'proxy' } = defaultOptions || {};

	return ky.extend({
		timeout: 30_000,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		prefixUrl: getPrefixedUrl(requestMode),
		...defaultOptions,
	});
};
