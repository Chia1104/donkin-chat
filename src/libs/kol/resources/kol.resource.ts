import { z } from 'zod';

import { kolAlertPipe } from '@/libs/kol/pipes/kol.pipe';
import type { KolAlert } from '@/libs/kol/pipes/kol.pipe';
import type { BaseRequestOptions, ResponseData } from '@/types/request';
import { request } from '@/utils/request';

export const getKolAlerts = async (options?: BaseRequestOptions<{ token_address: string }>) => {
	const response = await request({ requestMode: 'node-endpoint' })
		.get('api/v1/kol_alerts_by_token', {
			searchParams: {
				token_address: options?.data?.token_address ?? '',
			},
		})
		.json<ResponseData<KolAlert[]>>();

	return z.array(kolAlertPipe).parse(response.data);
};
