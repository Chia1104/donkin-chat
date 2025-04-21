import { cache } from 'react';

import { cookies } from 'next/headers';
import 'server-only';

import { INVITATION_TOKEN_NAME } from '../constants';
import {
	verifyInvitationCode as verifyInvitationCodeAPI,
	verifyInvitationToken as verifyInvitationTokenAPI,
} from './invitations.resource';

export const verifyInvitationCode = cache(verifyInvitationCodeAPI);
export const verifyInvitationToken = cache(async (token?: string) => {
	const cookieStore = await cookies();
	token = token ?? cookieStore.get(INVITATION_TOKEN_NAME)?.value;

	if (!token) {
		return false;
	}

	try {
		await verifyInvitationTokenAPI(token);
		return true;
	} catch {
		return false;
	}
});
