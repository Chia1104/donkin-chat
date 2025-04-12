import type { BaseRequestOptions } from '@/types/request';
import { request } from '@/utils/request';

import { transactionsPipe } from '../pipes/transactions.pipe';
import type { Transactions } from '../pipes/transactions.pipe';

export interface RequestDTO {
	token_address: string;
	start_time: string;
	end_time: string;
}

export const getTransactions = async (options?: BaseRequestOptions<RequestDTO>) => {
	const res = await request()
		.get('api/v1/analytics/token/transactions', {
			searchParams: {
				token_address: options?.data?.token_address ?? '',
				start_time: options?.data?.start_time ?? '',
				end_time: options?.data?.end_time ?? '',
			},
			signal: options?.signal,
			headers: options?.headers,
			timeout: options?.timeout,
		})
		.json<Transactions>();

	return transactionsPipe.parse(res);
};
