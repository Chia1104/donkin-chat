import type { ResponseData } from '@/types/request';

export class ParseJSONError extends Error {
	constructor(public readonly error: Error) {
		super('Failed to parse JSON');
	}
}

export const errorConfig = {
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	408: 'Request Timeout',
	429: 'Too Many Requests',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	503: 'Service Unavailable',
} as const;

export function errorGenerator<TData = unknown>(
	statusCode: number,
	errors?: Partial<ResponseData<TData>>,
): ResponseData<TData> {
	if (!(statusCode in errorConfig)) {
		return {
			code: 500,
			message: 'Unknown',
			data: {} as TData,
			...errors,
		};
	}
	return {
		code: statusCode,
		message: errorConfig[statusCode as keyof typeof errorConfig] ?? 'Unknown',
		data: {} as TData,
		...errors,
	};
}
