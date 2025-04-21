import { cache } from 'react';

import { cookies } from 'next/headers';
import 'server-only';

import { env } from '@/utils/env';
import { base64Decode } from '@/utils/format';

import { privy } from '../client.rsc';
import { PRIVY_ID_TOKEN, PRIVY_TOKEN } from '../constants';

export const verifyAuthToken = cache(async (token?: string) => {
	const cookieStore = await cookies();
	token = token ?? cookieStore.get(PRIVY_TOKEN)?.value;
	if (!token) {
		return null;
	}
	return await privy.verifyAuthToken(token, base64Decode(env.PRIVY_VERIFICATION_KEY_BASE64));
});

export const getUser = cache(async (idToken?: string) => {
	const cookieStore = await cookies();
	idToken = idToken ?? cookieStore.get(PRIVY_ID_TOKEN)?.value;
	if (!idToken) {
		return null;
	}
	return await privy.getUser({ idToken });
});
