import { IS_DEV } from './env';

export const logger = (
	message?: any,
	{
		type = 'log',
		enabled = IS_DEV || typeof window === 'undefined',
	}: {
		type?: 'log' | 'error' | 'warn' | 'info' | 'debug';
		enabled?: boolean;
	} = {},
) => {
	if (enabled) {
		if (Array.isArray(message)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			console[type](...message);
		} else {
			console[type](message);
		}
	}
};

export const log = logger.bind(null, { type: 'log' });
export const error = logger.bind(null, { type: 'error' });
export const warn = logger.bind(null, { type: 'warn' });
export const info = logger.bind(null, { type: 'info' });
export const debug = logger.bind(null, { type: 'debug' });
