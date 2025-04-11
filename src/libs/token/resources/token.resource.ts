import type { TokenSort } from '@/libs/ai/enums/tokenSort.enum';
import type { ResponseData, PaginationData, BaseRequestOptions, PaginationRequestOptions } from '@/types/request';
import { request } from '@/utils/request';

import type { Token, SearchToken } from '../pipes/token.pipe';
import { tokenSchema, tokensPaginationSchema, searchTokensPaginationSchema } from '../pipes/token.pipe';

export type TokensHotRequestOptions = PaginationRequestOptions<
	[typeof TokenSort.Change, typeof TokenSort.Hot, typeof TokenSort.MarketCap, typeof TokenSort.UpTime]
>;
export type TokensHotResponse = PaginationData<Token>;

export type TokenSearchRequestOptions = PaginationRequestOptions & {
	token_keyword?: string;
};
export type TokenSearchResponse = PaginationData<SearchToken>;

export const getTokensHot = async (options?: BaseRequestOptions<TokensHotRequestOptions>) => {
	const response = await request()
		.get('api/v1/tokens/hot', {
			signal: options?.signal,
			searchParams: {
				page: options?.data?.page ?? '',
				page_size: options?.data?.page_size ?? '',
				sort_by: options?.data?.sort_by ? (options?.data?.sort_by === 'hot' ? '' : options?.data?.sort_by) : '',
				order: options?.data?.order ?? '',
			},
			timeout: options?.timeout,
			headers: options?.headers,
		})
		.json<ResponseData<TokensHotResponse>>();

	return tokensPaginationSchema.parse(response.data);
};

export const getToken = async (address: string) => {
	const response = await request().get(`api/v1/tokens/${address}`).json<ResponseData<Token>>();

	return tokenSchema.parse(response.data);
};

export const searchToken = async (options?: BaseRequestOptions<TokenSearchRequestOptions>) => {
	const response = await request({ requestMode: 'node-endpoint' })
		.get(`api/v1/token_infos`, {
			signal: options?.signal,
			searchParams: {
				token_keyword: options?.data?.token_keyword ?? '',
				page: options?.data?.page ?? '',
				page_size: options?.data?.page_size ?? '',
			},
			timeout: options?.timeout,
			headers: options?.headers,
			credentials: undefined,
		})
		.json<ResponseData<TokenSearchResponse>>();

	return searchTokensPaginationSchema.parse(response.data);
};
