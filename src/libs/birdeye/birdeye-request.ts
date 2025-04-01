import ky from 'ky';
import 'server-only';

import { env } from '@/utils/env';

const BIRDEYE_ENDPOINT = 'https://public-api.birdeye.so';

const birdeyeRequest = ky.create({
	prefixUrl: BIRDEYE_ENDPOINT,
	headers: {
		'X-API-KEY': env.BIRDEYE_API_KEY,
	},
	retry: 0,
});

export default birdeyeRequest;
