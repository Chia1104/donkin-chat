import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { Token } from '../pipes/token.pipe';
import { getTokensHot, getToken } from '../resources/token.resource';

export const useQueryTokensHot = (options?: Partial<UseQueryOptions<Token[], Error, Token[]>>) => {
	return useQuery<Token[], Error, Token[]>({
		queryKey: ['tokens-hot'],
		queryFn: getTokensHot,
		...options,
	});
};

export const useQueryToken = (address: string, options?: Partial<UseQueryOptions<Token, Error, Token>>) => {
	return useQuery<Token, Error, Token>({
		queryKey: ['token', address],
		queryFn: () => getToken(address),
		...options,
	});
};
