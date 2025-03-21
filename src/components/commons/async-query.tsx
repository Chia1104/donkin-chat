'use client';

import type { UseQueryResult, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import { Error } from './error';

interface Props<TData, TError extends Error, TInfinite extends boolean> {
	className?: string;
	children?:
		| React.ReactNode
		| ((
				queryResult: TInfinite extends true
					? UseInfiniteQueryResult<InfiniteData<TData>, TError>
					: UseQueryResult<TData, TError>,
		  ) => React.ReactNode);
	loadingFallback?: React.ReactNode;
	errorFallback?: React.ReactNode | ((error: TError) => React.ReactNode);
	queryResult: TInfinite extends true
		? UseInfiniteQueryResult<InfiniteData<TData>, TError>
		: UseQueryResult<TData, TError>;
	enable?: boolean;
	isInfinite?: TInfinite;
}

export const AsyncQuery = <TData, TError extends Error, TInfinite extends boolean>({
	children,
	loadingFallback,
	errorFallback,
	queryResult,
	enable = true,
}: Props<TData, TError, TInfinite>) => {
	if (!enable) {
		return typeof children === 'function' ? children(queryResult) : children;
	}

	if (queryResult.isLoading) {
		return loadingFallback;
	}

	if (queryResult.isError) {
		return (
			(typeof errorFallback === 'function' ? errorFallback(queryResult.error) : errorFallback) ?? (
				<Error error={queryResult.error} />
			)
		);
	}

	return typeof children === 'function' ? children(queryResult) : children;
};
