import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { SolanaNetworks } from '../enums/solana.enum';
import { getSolBalance } from '../services/solana.service';

export const useGetSolBalance = (
	options?: Partial<UseMutationOptions<number | undefined, Error, [string, SolanaNetworks]>>,
) => {
	return useMutation<number | undefined, Error, [string, SolanaNetworks]>({
		...options,
		mutationFn: ([address, network]) => getSolBalance(address, network),
	});
};

export const useQuerySolBalance = (
	query: {
		address: string;
		network: SolanaNetworks;
	},
	options?: Partial<UseQueryOptions<number | undefined, Error>>,
) => {
	return useQuery<number | undefined, Error>({
		...options,
		queryKey: ['sol-balance', query.address, query.network],
		queryFn: () => getSolBalance(query.address, query.network),
	});
};
