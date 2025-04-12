import { HTTPError } from 'ky';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import type { OhlcvItem } from '@/libs/birdeye/pipes/ohlcv.pipe';
import { ohlcvResponseSchema } from '@/libs/birdeye/pipes/ohlcv.pipe';
import { getOhlcv } from '@/libs/birdeye/services/ohlcv.service';
import type { BirdeyeResponse } from '@/libs/birdeye/types';
import type { ResponseData } from '@/types/request';
import { logger } from '@/utils/logger';

export async function GET(request: NextRequest) {
	try {
		const ohlcv = await getOhlcv(request);
		if (!ohlcv.success) {
			return NextResponse.json<ResponseData>(
				{
					code: 500,
					status: 'error',
					message: ohlcv.message,
					data: null,
				},
				{ status: 500 },
			);
		}

		const parsed = await ohlcvResponseSchema.parseAsync(ohlcv.data);

		return NextResponse.json<ResponseData<OhlcvItem[]>>({
			code: 200,
			status: 'success',
			data: parsed.items,
		});
	} catch (error) {
		logger(['Error in GET /api/birdeye/defi/ohlcv:', error], { type: 'error' });
		if (error instanceof HTTPError) {
			const res = await error.response.json<BirdeyeResponse>();
			if (res.success) {
				return NextResponse.json<ResponseData>(
					{
						code: 500,
						status: 'error',
						data: null,
					},
					{ status: 500 },
				);
			}
			return NextResponse.json<ResponseData>(
				{
					code: error.response.status,
					status: 'error',
					message: res.message,
					data: null,
				},
				{ status: error.response.status },
			);
		}
		if (error instanceof ZodError) {
			return NextResponse.json<ResponseData>(
				{
					code: 400,
					status: 'error',
					data: error.flatten().fieldErrors,
				},
				{
					status: 400,
				},
			);
		}
		return NextResponse.json<ResponseData>(
			{
				code: 500,
				status: 'error',
				message: 'Internal server error',
				data: null,
			},
			{
				status: 500,
			},
		);
	}
}
