'use client';

import type { UseQueryResult, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { HTTPError } from 'ky';

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
	enableLoadingFallback?: boolean;
	enableErrorFallback?: boolean;
}

export const AsyncQuery = <TData, TError extends Error, TInfinite extends boolean>({
	children,
	loadingFallback,
	errorFallback,
	queryResult,
	enable = true,
	enableLoadingFallback = true,
	enableErrorFallback = true,
}: Props<TData, TError, TInfinite>) => {
	if (queryResult.isLoading && enableLoadingFallback && enable) {
		return loadingFallback;
	}

	if (queryResult.isError && enableErrorFallback && enable) {
		return (
			(typeof errorFallback === 'function' ? errorFallback(queryResult.error) : errorFallback) ?? (
				<Error error={queryResult.error} enabledSentry={!(queryResult.error instanceof HTTPError)} />
			)
		);
	}

	return typeof children === 'function' ? children(queryResult) : children;
};
