import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { KolAlert } from '@/libs/kol/pipes/kol.pipe';
import { getKolAlerts } from '@/libs/kol/resources/kol.resource';

export const useGetKolAlerts = (
	tokenAddress: string,
	options?: Partial<UseQueryOptions<KolAlert[], Error, KolAlert[]>>,
) => {
	return useQuery<KolAlert[], Error, KolAlert[]>({
		queryKey: ['kol-alerts', tokenAddress],
		queryFn: ({ signal }) => getKolAlerts({ data: { token_address: tokenAddress }, signal }),
		...options,
	});
};
