'use server';

import { cookies } from 'next/headers';

import { FlagID } from '../services/flags';

export async function setFeatureFlag(enabled: boolean) {
	const cookieStore = await cookies();
	cookieStore.set(FlagID.CookieFeatures, JSON.stringify({ settings: enabled }));
}
