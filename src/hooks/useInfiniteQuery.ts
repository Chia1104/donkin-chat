import { useMemo } from 'react';

import { useInfiniteQuery as _useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';

import type { UseInfiniteQueryOptions } from '@/types/react-query';
import type { PaginationData } from '@/types/request';

export type QueryOptions<TData> = Omit<
	UseInfiniteQueryOptions<PaginationData<TData>>,
	'getNextPageParam' | 'initialPageParam'
>;

export const useInfiniteQuery = <TData, TRequest = unknown>(options: QueryOptions<TData>, request?: TRequest) => {
	const result = _useInfiniteQuery<
		PaginationData<TData>,
		Error,
		InfiniteData<PaginationData<TData>, number>,
		QueryKey,
		number
	>({
		...options,
		queryKey: options.queryKey.concat(request),
		getNextPageParam: lastPage => {
			const { total, page, page_size } = lastPage;

			return total > page * page_size ? page + 1 : undefined;
		},
		initialPageParam: 1,
	});
	const flatData = useMemo(() => {
		return result.data?.pages.flatMap(page => page.data) ?? [];
	}, [result.data]);

	return {
		flatData,
		...result,
	};
};
