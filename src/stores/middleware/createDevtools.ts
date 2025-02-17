import { optionalDevtools } from 'zustand-utils';
import type { devtools as _devtools } from 'zustand/middleware';

import { IS_DEV } from '@/utils/env';

export const createDevtools =
	(name: string): typeof _devtools =>
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

		return optionalDevtools(showDevtools)(initializer, {
			name: `Donkin_${name}` + (IS_DEV ? '_DEV' : ''),
		});
	};
