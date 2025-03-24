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
export const fetchStream = async <T = unknown>(input: RequestInfo, payload: T, init?: RequestInit) => {
	const response = await fetch(input, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'text/event-stream',
		},
		body: JSON.stringify(payload),
		credentials: 'include',
		...init,
	});

	if (!response.ok) throw new Error('Stream request failed');

	if (typeof response.body === 'undefined' || typeof response.body?.getReader() === 'undefined')
		throw new Error('Stream response body is undefined');

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	return {
		[Symbol.asyncIterator]: async function* () {
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
	};
};
