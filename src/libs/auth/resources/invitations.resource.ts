import type { ResponseData } from '@/types/request';
import { request } from '@/utils/request';

import type { VerifyInvitationCodeResponse, LoginWithInvitationCodeResponse } from '../pipes/invitations.pipe';
import { verifyInvitationCodeResponseSchema, loginWithInvitationCodeResponseSchema } from '../pipes/invitations.pipe';

export const verifyInvitationCode = async (code: string) => {
	const response = await request({ requestMode: 'proxy-invitations-api' })
		.post('api/v1/invitations/verify', {
			json: {
				code,
			},
		})
		.json<ResponseData<VerifyInvitationCodeResponse>>();

	return verifyInvitationCodeResponseSchema.parse(response.data);
};

export const verifyInvitationToken = async (token: string) => {
	const response = await request({ requestMode: 'proxy-invitations-api' })
		.post('api/v1/invitations/verify-token', {
			json: { token },
		})
		.json<ResponseData<LoginWithInvitationCodeResponse>>();

	return loginWithInvitationCodeResponseSchema.parse(response.data);
};

export const bindInvitationCode = async (code: string, walletAddress: string) => {
	const response = await request({ requestMode: 'proxy-invitations-api' })
		.post('api/v1/invitations/bind', {
			json: { code, wallet_address: walletAddress },
		})
		.json<ResponseData<void>>();

	return response;
};

export const loginWithInvitationCode = async (code: string, walletAddress: string) => {
	const response = await request({ requestMode: 'proxy-invitations-api' })
		.post('api/v1/invitations/login', {
			json: { code, wallet_address: walletAddress },
		})
		.json<ResponseData<LoginWithInvitationCodeResponse>>();

	return loginWithInvitationCodeResponseSchema.parse(response.data);
};
