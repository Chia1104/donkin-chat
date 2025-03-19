import { useMemo } from 'react';

import type { UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, QueryKey } from '@tanstack/react-query';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import type { Token } from '../pipes/token.pipe';
import { getTokensHot, getToken } from '../resources/token.resource';
import type { TokensHotRequestOptions, TokensHotResponse } from '../resources/token.resource';

export const useQueryToken = (address: string, options?: Partial<UseQueryOptions<Token, Error, Token>>) => {
	return useQuery<Token, Error, Token>({
		queryKey: ['token', address],
		queryFn: () => getToken(address),
		...options,
	});
};

export type QueryTokensHotOptions = Omit<
	UseInfiniteQueryOptions<
		TokensHotResponse,
		Error,
		InfiniteData<TokensHotResponse>,
		TokensHotResponse,
		QueryKey,
		number
	>,
	'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
>;

export const useQueryTokensHot = (requestOptions?: TokensHotRequestOptions, options?: QueryTokensHotOptions) => {
	const { data, ...rest } = useInfiniteQuery({
		queryKey: ['tokens-hot', requestOptions],
		queryFn: ({ pageParam, signal }) =>
			getTokensHot({
				signal,
				data: {
					...requestOptions,
					page: pageParam,
				},
			}),
		getNextPageParam: lastPage => {
			const { total, page, page_size } = lastPage;

			return total > page * page_size ? page + 1 : undefined;
		},
		initialPageParam: 1,
		...options,
	});
	const flatData = useMemo(() => {
		return data?.pages.flatMap(page => page.data) ?? [];
	}, [data]);

	return {
		data,
		flatData,
		...rest,
	};
};
