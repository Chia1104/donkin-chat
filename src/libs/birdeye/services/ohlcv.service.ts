import type { NextRequest } from 'next/server';
import 'server-only';

import birdeyeRequest from '../birdeye-request';
import { ohlcvRequestSchema } from '../pipes/ohlcv.pipe';
import type { OhlcvResponse } from '../pipes/ohlcv.pipe';
import type { BirdeyeResponse } from '../types';

export const getOhlcv = async (request: NextRequest) => {
	const { address, chain, type, currency, time_from, time_to } = ohlcvRequestSchema.parse({
		address: request.nextUrl.searchParams.get('address') ?? undefined,
		chain: request.nextUrl.searchParams.get('chain') ?? undefined,
		type: request.nextUrl.searchParams.get('type') ?? undefined,
		currency: request.nextUrl.searchParams.get('currency') ?? undefined,
		time_from: request.nextUrl.searchParams.get('time_from') ?? undefined,
		time_to: request.nextUrl.searchParams.get('time_to') ?? undefined,
	});

	const response = await birdeyeRequest.get(`defi/ohlcv`, {
		searchParams: {
			time_from,
			time_to,
			address,
			type,
			currency,
		},
		headers: {
			'x-chain': chain,
		},
	});

	return response.json<BirdeyeResponse<OhlcvResponse>>();
};
