import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { TokenSmartWalletCount } from '../pipes/token.pipe';
import { getTokenSmartWalletCount } from '../resources/token.resource';

export const useQueryTokenSmartWallet = (
	address: string,
	options?: Partial<UseQueryOptions<TokenSmartWalletCount, Error, TokenSmartWalletCount>>,
) => {
	return useQuery<TokenSmartWalletCount, Error, TokenSmartWalletCount>({
		queryKey: ['token', 'smart_wallet_count', address],
		queryFn: () => getTokenSmartWalletCount(address),
		...options,
	});
};
