import type { ResponseData } from '@/types/request';
import { request } from '@/utils/request';

import type { Token } from '../pipes/token.pipe';
import { tokenSchema, tokensSchema } from '../pipes/token.pipe';

export const getTokensHot = async () => {
	const response = await request().get('api/v1/tokens/hot').json<ResponseData<Token[]>>();

	return tokensSchema.parse(response.data);
};

export const getToken = async (address: string) => {
	const response = await request().get(`api/v1/tokens/${address}`).json<ResponseData<Token>>();

	return tokenSchema.parse(response.data);
};
