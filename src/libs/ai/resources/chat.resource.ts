import type { CoreMessage } from 'ai';

import type { BaseRequestOptions, AIResponseData } from '@/types/request';
import { request, withPrefixedUrl } from '@/utils/request';

import { tokenInfoSchema } from '../pipes/token.pipe';

const AI_ENDPOINT = 'api/chat';

/**
 * @deprecated use `useChat` with `swr` instead
 */
export const chat = (options: BaseRequestOptions<CoreMessage[]>) => {
	return fetch(withPrefixedUrl(AI_ENDPOINT), {
		method: 'POST',
		body: JSON.stringify(options.data),
		signal: options.signal,
	});
};

export const getTokenInfo = async (token: string) => {
	const response = await request({ requestMode: 'proxy-ai', timeout: 60_000 })
		.post(`api/v1/ai/token_info`, {
			json: {
				token,
			},
		})
		.json<AIResponseData<{ token_info: string }>>();

	return tokenInfoSchema.parse(response.data);
};
