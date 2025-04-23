import ky from 'ky';
import type { Options } from 'ky';

import { env } from '../env';

type RequestOptions = {
	requestMode?: RequestMode;
} & Options;

export type RequestMode =
	| 'proxy-service'
	| 'self-api'
	| 'public-service'
	| 'proxy-public-service'
	| 'ai'
	| 'proxy-ai'
	| 'node-endpoint';

const getPrefixedUrl = (requestMode?: RequestMode) => {
	const IS_SERVER = typeof window === 'undefined';
	switch (requestMode) {
		case 'proxy-service':
			return !IS_SERVER ? '/proxy/service' : env.NEXT_PUBLIC_SERVICE_ENDPOINT;
		case 'self-api': {
			if (IS_SERVER) {
				throw new Error('self-api is not supported on server');
			}
			return '/';
		}
		case 'public-service':
			return env.NEXT_PUBLIC_PUBLIC_SERVICE_ENDPOINT;
		case 'proxy-public-service':
			return !IS_SERVER ? '/proxy' : env.NEXT_PUBLIC_PUBLIC_SERVICE_ENDPOINT;
		case 'ai':
			return env.NEXT_PUBLIC_AI_SERVICE_ENDPOINT;
		case 'proxy-ai':
			return !IS_SERVER ? '/proxy/ai' : env.NEXT_PUBLIC_AI_SERVICE_ENDPOINT;
		case 'node-endpoint':
			return env.NEXT_PUBLIC_APP_NODE_ENDPOINT;
		default:
			return !IS_SERVER ? '/proxy' : env.NEXT_PUBLIC_PUBLIC_SERVICE_ENDPOINT;
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
	const { requestMode = 'proxy-public-service' } = defaultOptions || {};

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
