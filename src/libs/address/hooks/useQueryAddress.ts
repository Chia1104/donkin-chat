import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { IntervalFilter } from '../enums/interval-filter.enum';
import type { Address } from '../pipes/address.pipe';
import { getAddress } from '../resources/address.resource';

export const useQueryAddress = (
	requestOptions: {
		address: string;
		interval: IntervalFilter;
		timeout?: number;
	},
	options?: Partial<UseQueryOptions<Address, Error, Address>>,
) => {
	return useQuery<Address, Error, Address>({
		queryKey: ['address', requestOptions.address, requestOptions.interval],
		queryFn: ({ signal }) =>
			getAddress(requestOptions.address, {
				data: {
					interval: requestOptions.interval,
				},
				signal,
				timeout: requestOptions.timeout,
			}),
		...options,
	});
};
