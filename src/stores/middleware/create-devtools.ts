import { devtools } from 'zustand/middleware';

import { IS_PRODUCTION, env } from '@/utils/env';

export const createDevtools =
	(name: string): typeof devtools =>
	initializer => {
		let showDevtools = false;

		// check url to show devtools
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			const debug = url.searchParams.get('debug');
			if (debug?.includes(name)) {
				showDevtools = true;
			}
		}

		return devtools(initializer, {
			name: `Donkin_${name}` + (!IS_PRODUCTION ? '_DEV' : ''),
			enabled: env.NEXT_PUBLIC_DEBUG_ZUSTAND_DEVTOOLS === 'true' ? true : showDevtools,
		});
	};
