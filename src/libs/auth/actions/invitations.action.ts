'use server';

import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import 'server-only';

import { actionClient } from '@/libs/safe-action';
import { IS_DEV } from '@/utils/env';
import { logger } from '@/utils/logger';
import { tryCatch } from '@/utils/try-catch';

import { INVITATION_TOKEN_NAME } from '../constants';
import { CodeVerify } from '../enums/codeVerify.enum';
import type { BindInvitationCodeResponse } from '../pipes/invitations.pipe';
import { bindInvitationCodeSchema } from '../pipes/invitations.pipe';
import {
	bindInvitationCode as bindInvitationCodeAPI,
	loginWithInvitationCode as loginWithInvitationCodeAPI,
	verifyInvitationCode as verifyInvitationCodeAPI,
} from '../resources/invitations.resource';

export const bindInvitationCode = actionClient
	.schema(bindInvitationCodeSchema)
	.action(async ({ parsedInput: { code, wallet_address } }): Promise<BindInvitationCodeResponse> => {
		const t = await getTranslations('auth.invitation');

		const { data: verifyResponse, error: verifyError } = await tryCatch(verifyInvitationCodeAPI(code));

		if (verifyError) {
			logger(['bindInvitationCode', 'verifyError', verifyError]);
			return {
				success: false,
				code: CodeVerify.Invalid,
				message: t('error.invalid'),
			} as const;
		} else if (verifyResponse.wallet_address === wallet_address) {
			return {
				success: true,
				code: CodeVerify.Matched,
				message: t('success.already-bound'),
			} as const;
		} else if (verifyResponse.is_used && verifyResponse.wallet_address !== wallet_address) {
			logger(['bindInvitationCode', 'verifyResponse', verifyResponse]);
			return {
				success: false,
				code: CodeVerify.Unmatched,
				message: t('error.already-bound'),
			} as const;
		}

		const { data: bindResponse, error: bindError } = await tryCatch(bindInvitationCodeAPI(code, wallet_address));

		if (bindError || bindResponse.code !== 200) {
			logger(['bindInvitationCode', 'bindError', bindError]);
			return {
				success: false,
				code: CodeVerify.Invalid,
				message: t('error.default'),
			} as const;
		}

		return {
			success: true,
			code: CodeVerify.Matched,
			message: t('success.default'),
		} as const;
	});

export const loginWithInvitationCode = actionClient
	.schema(bindInvitationCodeSchema)
	.action(async ({ parsedInput: { code, wallet_address } }) => {
		const t = await getTranslations('auth.invitation');
		try {
			const cookieStore = await cookies();

			const response = await loginWithInvitationCodeAPI(code, wallet_address);

			cookieStore.set(INVITATION_TOKEN_NAME, response.token, {
				httpOnly: true,
				secure: !IS_DEV,
				sameSite: 'lax',
			});

			return {
				success: true,
				code: CodeVerify.Matched,
				message: response.login_count > 1 ? t('success.login') : t('success.default'),
			} as const;
		} catch (error) {
			logger(['loginWithInvitationCode', 'error', error]);
			return {
				success: false,
				code: CodeVerify.Invalid,
				message: t('error.default'),
			} as const;
		}
	});

export const logout = actionClient.action(async () => {
	const cookieStore = await cookies();
	cookieStore.delete(INVITATION_TOKEN_NAME);
});
