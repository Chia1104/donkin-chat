import { useMemo } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';

import _config from '~/tailwind.config';

export const experimental_useTailwindTheme = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const config = useMemo(() => resolveConfig(_config), []);

	return config;
};
