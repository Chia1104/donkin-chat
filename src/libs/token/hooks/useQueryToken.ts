import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { QueryOptions } from '@/hooks/useInfiniteQuery';
import { useInfiniteQuery } from '@/hooks/useInfiniteQuery';

import type { Token, SearchToken } from '../pipes/token.pipe';
import { getTokensHot, getToken, searchToken } from '../resources/token.resource';
import type { TokensHotRequestOptions, TokenSearchRequestOptions } from '../resources/token.resource';

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

export type QueryTokenSearchOptions = Omit<
	QueryOptions<SearchToken>,
	'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
>;

export const useQueryTokensHot = (
	requestOptions?: TokensHotRequestOptions & { mock?: boolean },
	options?: QueryTokensHotOptions,
) => {
	return useInfiniteQuery(
		{
			queryKey: ['tokens-hot'],
			queryFn: ({ pageParam, signal }) =>
				getTokensHot({
					mock: requestOptions?.mock,
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

export const useQueryTokenSearch = (requestOptions?: TokenSearchRequestOptions, options?: QueryTokenSearchOptions) => {
	return useInfiniteQuery(
		{
			queryKey: ['tokens-search', requestOptions?.token_keyword],
			queryFn: ({ pageParam, signal }) =>
				searchToken({
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
