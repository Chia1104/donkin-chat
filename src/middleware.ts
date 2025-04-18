import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from '@/libs/i18n/routing';
import { HEADERS_SEARCH_PARAMS } from '@/utils/constants';

export default function middleware(request: NextRequest) {
	const handleI18nRouting = createMiddleware(routing);
	const response = handleI18nRouting(request);
	const searchParams = request.nextUrl.searchParams.toString();
	response.headers.set(HEADERS_SEARCH_PARAMS, searchParams);

	return response;
}

export const config = {
	/**
	 * localePrefix: 'never'
	 */
	matcher: [
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		'/((?!api|proxy-api|proxy-ai-api|_next|_vercel|.*\\..*).*)',
	],
	/**
	 * localePrefix: 'always'
	 */
	// matcher: ['/', '/(zh-TW|en-US|zh-CN)/:path*'],
};
