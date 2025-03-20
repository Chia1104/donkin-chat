import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { QueryOptions } from '@/hooks/useInfiniteQuery';
import { useInfiniteQuery } from '@/hooks/useInfiniteQuery';

import type { Token } from '../pipes/token.pipe';
import { getTokensHot, getToken } from '../resources/token.resource';
import type { TokensHotRequestOptions } from '../resources/token.resource';

export const useQueryToken = (address: string, options?: Partial<UseQueryOptions<Token, Error, Token>>) => {
	return useQuery<Token, Error, Token>({
		queryKey: ['token', address],
		queryFn: () => getToken(address),
		...options,
	});
};

export type QueryTokensHotOptions = Omit<
	QueryOptions<Token>,
	'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
>;

export const useQueryTokensHot = (requestOptions?: TokensHotRequestOptions, options?: QueryTokensHotOptions) => {
	return useInfiniteQuery(
		{
			queryKey: ['tokens-hot'],
			queryFn: ({ pageParam, signal }) =>
				getTokensHot({
					signal,
					data: {
						...requestOptions,
						page: pageParam,
					},
				}),
			...options,
		},
		requestOptions,
	);
};
