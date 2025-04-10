import createMiddleware from 'next-intl/middleware';

import { routing } from '@/libs/i18n/routing';

export default createMiddleware(routing);

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
