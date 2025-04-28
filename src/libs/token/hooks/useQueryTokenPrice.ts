import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { TokenPrice } from '../pipes/token.pipe';
import { getTokenPrice } from '../resources/token.resource';

export const useQueryTokenPrice = (
	address: string,
	options?: Partial<UseQueryOptions<TokenPrice, Error, TokenPrice>>,
) => {
	return useQuery<TokenPrice, Error, TokenPrice>({
		queryKey: ['token', 'price', address],
		queryFn: () => getTokenPrice(address),
		...options,
	});
};
