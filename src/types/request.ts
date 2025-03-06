export interface BaseRequestOptions<TData = unknown> {
	data?: TData;
	signal?: AbortSignal;
}

export interface ResponseData<TData = unknown> {
	code: number;
	status: 'success' | 'error';
	data: TData;
}
