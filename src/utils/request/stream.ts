import setSearchParams from '../set-search-params';

/**
 * Fetches a stream response from the provided input URL with the specified payload.
 *
 * @template T - The type of the payload.
 * @param input - The input URL or Request object.
 * @param payload - The payload to be sent with the POST request.
 * @returns - An async iterable object that yields chunks of the stream response as strings.
 *
 * @throws Will throw an error if the stream request fails or if the response body is undefined.
 *
 * @example
 * ```typescript
 * const stream = fetchStream('https://example.com/stream', { data: 'example' });
 * for await (const chunk of stream) {
 *   console.log(chunk);
 * }
 * ```
 */
export const fetchStream = async <T = unknown>(
	input: RequestInfo,
	payload: T,
	init?: RequestInit & {
		searchParams?: Record<string, string>;
	},
) => {
	const response = await fetch(
		setSearchParams(init?.searchParams, {
			baseUrl: input as string,
		}),
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream',
			},
			body: init?.method === 'GET' ? undefined : JSON.stringify(payload),
			credentials: 'include',
			...init,
		},
	);

	if (!response.ok) throw new Error('Stream request failed');

	const body = response.body;
	if (!body) throw new Error('Stream response body is undefined');

	const decoder = new TextDecoder();

	return {
		[Symbol.asyncIterator]: async function* () {
			const reader = body.getReader();
			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					yield chunk;
				}
			} finally {
				reader.releaseLock();
			}
		},
		stream: body,
	};
};
