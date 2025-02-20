export const fetchStream = async <T = unknown>(payload: T) => {
	const response = await fetch('/api/chat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'text/event-stream',
		},
		body: JSON.stringify(payload),
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
