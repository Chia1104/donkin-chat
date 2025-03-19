import type { ResponseData, PaginationData, BaseRequestOptions, PaginationRequestOptions } from '@/types/request';
import { request } from '@/utils/request';

import type { Token } from '../pipes/token.pipe';
import { tokenSchema, tokensPaginationSchema } from '../pipes/token.pipe';

export type TokensHotRequestOptions = PaginationRequestOptions<['price_change_24h', 'market_cap', 'created_at', 'hot']>;
export type TokensHotResponse = PaginationData<Token>;

export const getTokensHot = async (options?: BaseRequestOptions<TokensHotRequestOptions>) => {
	const response = await request()
		.get('api/v1/tokens/hot', {
			signal: options?.signal,
			searchParams: {
				page: options?.data?.page ?? '',
				page_size: options?.data?.page_size ?? '',
				sort_by: options?.data?.sort_by ?? '',
				order: options?.data?.order ?? '',
			},
		})
		.json<ResponseData<TokensHotResponse>>();

	return tokensPaginationSchema.parse(response.data);
};

export const getToken = async (address: string) => {
	const response = await request().get(`api/v1/tokens/${address}`).json<ResponseData<Token>>();

	return tokenSchema.parse(response.data);
};
