import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useQuery, useMutation } from '@tanstack/react-query';

import type { Transactions } from '../pipes/transactions.pipe';
import type { RequestDTO } from '../resources/transactions.resource';
import { getTransactions } from '../resources/transactions.resource';

type QueryOPtions = Omit<UseQueryOptions<Transactions, Error, Transactions>, 'queryKey' | 'queryFn'>;

export const useQueryTransactions = (request: RequestDTO, options?: QueryOPtions) => {
	return useQuery({
		...options,
		queryKey: ['token', 'transactions', request.token_address, request.interval],
		queryFn: ({ signal }) => getTransactions({ data: request, signal }),
	});
};

export const useMutationTransactions = (options?: UseMutationOptions<Transactions, Error, RequestDTO>) => {
	return useMutation({
		...options,
		mutationFn: dto => getTransactions({ data: dto }),
	});
};
