export interface BaseRequestOptions<TData = unknown> {
	data?: TData;
	signal?: AbortSignal;
	headers?: Headers;
	timeout?: number;
}

export interface ResponseData<TData = unknown> {
	code: number;
	status: 'success' | 'error';
	message?: string;
	data: TData;
}

export interface AIResponseData<TData = unknown> {
	code: number;
	msg?: string;
	data: TData;
}

export interface PaginationData<TData = unknown> {
	total: number;
	page: number;
	page_size: number;
	data: TData[];
}

export interface PaginationRequestOptions<TSort extends string[] = []> {
	page?: number;
	page_size?: number;
	sort_by?: TSort[number];
	order?: 'asc' | 'desc';
}
