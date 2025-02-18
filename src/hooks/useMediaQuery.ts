import { useMediaQuery as _useMediaQuery } from 'usehooks-ts';

export const useMediaQuery = () => {
	const isSmWidth = _useMediaQuery('(min-width: 640px)');
	const isMdWidth = _useMediaQuery('(min-width: 768px)');
	const isLgWidth = _useMediaQuery('(min-width: 1024px)');

	return { isSmWidth, isMdWidth, isLgWidth };
};
