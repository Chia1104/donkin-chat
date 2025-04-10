import type { formats } from '@/libs/i18n/request';
import type { routing } from '@/libs/i18n/routing';

import type en_us from '~/messages/en-US.json';

type Messages = typeof en_us;

declare module 'next-intl' {
	interface AppConfig {
		Messages: Messages;
		Formats: typeof formats;
	}

	interface AppConfig {
		// ...
		Locale: (typeof routing.locales)[number];
	}
}
