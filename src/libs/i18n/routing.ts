import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { Locale } from '@/enums/locale.enum';
import { env } from '@/utils/env';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: Object.values(Locale),

	// Used when no locale matches
	defaultLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,

	localePrefix: 'never',

	localeCookie: {
		name: 'donkin-locale',
	},
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter: useLocaleRouter, getPathname } = createNavigation(routing);
