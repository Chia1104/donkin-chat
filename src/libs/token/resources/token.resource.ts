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
	if (options?.mock) {
		return tokensPaginationSchema.parse({
			total: 40,
			page: 1,
			page_size: 40,
			data: Array.from({ length: 40 }, (_, index) => ({
				address: `0x${index.toString(16).padStart(40, '0')}`,
				chain_id: 1,
				symbol: `TOKEN${index}`,
				name: `Token ${index}`,
				decimals: 18,
				price: 100 + index,
				daily_volume: 100 + index,
				market_cap: 100 + index,
				price_change_24h: 100 + index,
				volume_24h: 100 + index,
				liquidity: 100 + index,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				last_trade_time: new Date().toISOString(),
				freeze_authority: `0x${index.toString(16).padStart(40, '0')}`,
				mint_authority: `0x${index.toString(16).padStart(40, '0')}`,
				permanent_delegate: `0x${index.toString(16).padStart(40, '0')}`,
				minted_at: new Date().toISOString(),
				coingecko_id: `token${index}`,
				change: 100 + index,
			})),
		} satisfies TokensHotResponse);
	}
	const response = await request({ requestMode: 'proxy-service' })
		.get('api/v1/tokens/hot', {
			signal: options?.signal,
			searchParams: {
				page: options?.data?.page ?? '',
				page_size: options?.data?.page_size ?? '',
				sort_by: options?.data?.sort_by ?? '',
				order: options?.data?.order ?? '',
			},
			timeout: options?.timeout,
			headers: options?.headers,
		})
		.json<ResponseData<TokensHotResponse>>();

	return tokensPaginationSchema.parse(response.data);
};

export const getToken = async (address: string) => {
	const response = await request({ requestMode: 'proxy-service' })
		.get(`api/v1/tokens/${address}`)
		.json<ResponseData<Token>>();

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
