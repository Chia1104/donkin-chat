import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { useTransitionRouter } from 'next-view-transitions';

import { Locale } from '@/types/locale';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: Object.values(Locale),

	// Used when no locale matches
	defaultLocale: Locale.EN_US,

	localePrefix: 'never',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, /* useRouter, */ getPathname } = createNavigation(routing);
export const useRouter = useTransitionRouter;
