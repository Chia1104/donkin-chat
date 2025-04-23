import type { ResponseData, BaseRequestOptions } from '@/types/request';
import { request } from '@/utils/request';

import type { IntervalFilter } from '../enums/interval-filter.enum';
import type { Address } from '../pipes/address.pipe';
import { addressSchema } from '../pipes/address.pipe';

export const getAddress = async (
	address: string,
	options?: BaseRequestOptions<{ interval: IntervalFilter; include_transactions?: boolean }>,
) => {
	const response = await request({ timeout: options?.timeout, requestMode: 'proxy-service' })
		.get(`api/v1/wallet/current/${address}`, {
			searchParams: {
				interval: options?.data?.interval ?? '',
				include_transactions: options?.data?.include_transactions ? 'true' : '',
			},
			timeout: 120_000,
		})
		.json<ResponseData<Address>>();
	return addressSchema.parse(response.data);
};
