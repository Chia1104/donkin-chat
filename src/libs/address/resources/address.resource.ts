import type { ResponseData, BaseRequestOptions } from '@/types/request';
import { request } from '@/utils/request';

import type { IntervalFilter } from '../enums/interval-filter.enum';
import type { Address } from '../pipes/address.pipe';
import { addressSchema } from '../pipes/address.pipe';

export const getAddress = async (address: string, options?: BaseRequestOptions<{ interval: IntervalFilter }>) => {
	const response = await request()
		.get(`api/v1/wallet/current/${address}`, {
			searchParams: {
				interval: options?.data?.interval ?? '',
			},
		})
		.json<ResponseData<Address>>();
	return addressSchema.parse(response.data);
};
