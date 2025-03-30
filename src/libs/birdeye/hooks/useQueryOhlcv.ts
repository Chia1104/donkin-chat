import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import type { BaseRequestOptions } from '@/types/request';
import type { ResponseData } from '@/types/request';
import { request } from '@/utils/request';

import type { OhlcvRequest, OhlcvItem, OhlcvItemDTO } from '../pipes/ohlcv.pipe';
import { ohlcvItemDTOSchema } from '../pipes/ohlcv.pipe';

export type OlcvResponse = OhlcvItem[];
export type OlcvResponseDTO = OhlcvItemDTO[];

export const getOhlcv = async (options: BaseRequestOptions<Partial<OhlcvRequest>>, test?: boolean) => {
	const response = await request({ requestMode: 'self-api' })
		.get(test ? 'api/birdeye/defi/ohlcv/mock' : 'api/birdeye/defi/ohlcv', {
			searchParams: options.data,
		})
		.json<ResponseData<OlcvResponse>>();

	return z.array(ohlcvItemDTOSchema).parse(response.data);
};

type QueryOptions = UseQueryOptions<OlcvResponseDTO, Error, OlcvResponseDTO>;

export const useQueryOhlcv = (
	request: BaseRequestOptions<Partial<OhlcvRequest>>,
	options?: Partial<Omit<QueryOptions, 'queryKey' | 'queryFn'>>,
) => {
	return useQuery<OlcvResponseDTO, Error, OlcvResponseDTO>({
		...options,
		queryKey: ['birdeye', 'ohlcv', request.data?.address, request.data?.type],
		queryFn: ({ signal }) => getOhlcv({ ...request, signal }),
	});
};

export const useMutationOhlcv = <TContext = unknown>(
	options?: Partial<
		Omit<UseMutationOptions<OlcvResponseDTO, Error, BaseRequestOptions<Partial<OhlcvRequest>>, TContext>, 'mutationFn'>
	>,
) => {
	return useMutation<OlcvResponseDTO, Error, BaseRequestOptions<Partial<OhlcvRequest>>, TContext>({
		...options,
		mutationFn: request => getOhlcv(request),
	});
};
