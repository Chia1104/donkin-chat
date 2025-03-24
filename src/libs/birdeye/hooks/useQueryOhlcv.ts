import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { BaseRequestOptions } from '@/types/request';
import type { ResponseData } from '@/types/request';
import { request } from '@/utils/request';

import type { OhlcvRequest } from '../pipes/ohlcv.pipe';
import type { OhlcvItem } from '../pipes/ohlcv.pipe';

export const getOhlcv = async (options: BaseRequestOptions<Partial<OhlcvRequest>>) => {
	const response = await request({ requestMode: 'self-api' }).get('api/birdeye/defi/ohlcv', {
		searchParams: options.data,
	});

	return response.json<ResponseData<OhlcvItem[]>>();
};

type QueryOptions = UseQueryOptions<ResponseData<OhlcvItem[]>, Error, ResponseData<OhlcvItem[]>>;

export const useQueryOhlcv = (
	request: BaseRequestOptions<Partial<OhlcvRequest>>,
	options?: Partial<Omit<QueryOptions, 'queryKey' | 'queryFn'>>,
) => {
	return useQuery<ResponseData<OhlcvItem[]>, Error, ResponseData<OhlcvItem[]>>({
		...options,
		queryKey: ['birdeye', 'ohlcv', request.data],
		queryFn: ({ signal }) => getOhlcv({ ...request, signal }),
	});
};
