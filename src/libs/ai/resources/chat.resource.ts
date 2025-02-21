import type { CoreMessage } from 'ai';

import type { BaseRequestOptions } from '@/types/request';
import { getPrefixedUrl } from '@/utils/request';

const AI_ENDPOINT = 'api/chat';

/**
 * @deprecated use `useChat` with `swr` instead
 */
export const chat = (options: BaseRequestOptions<CoreMessage[]>) => {
	return fetch(`${getPrefixedUrl()}${AI_ENDPOINT}`, {
		method: 'POST',
		body: JSON.stringify(options.data),
		signal: options.signal,
	});
};
