import type {
	UseInfiniteQueryOptions as TUseInfiniteQueryOptions,
	InfiniteData,
	QueryKey,
} from '@tanstack/react-query';

export type UseInfiniteQueryOptions<TData> = TUseInfiniteQueryOptions<
	TData,
	Error,
	InfiniteData<TData, number>,
	TData,
	QueryKey,
	number
>;
