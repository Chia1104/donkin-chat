import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { tryCatch } from '@/utils/try-catch';

import { bindInvitationCode, loginWithInvitationCode } from '../actions/invitations.action';
import { CodeVerify } from '../enums/codeVerify.enum';
import type { BindInvitationCode, BindInvitationCodeResponse } from '../pipes/invitations.pipe';

export const useLoginWithInvitationsCode = <TContext = unknown>(
	options?: UseMutationOptions<BindInvitationCodeResponse, Error, BindInvitationCode, TContext>,
) => {
	const t = useTranslations('auth.invitation');
	return useMutation({
		...options,
		mutationFn: async dto => {
			const { data: bindInvitationCodeData, error: bindInvitationCodeError } = await tryCatch(bindInvitationCode(dto));
			if (!bindInvitationCodeData?.data || bindInvitationCodeError) {
				return {
					success: false,
					code: CodeVerify.Invalid,
					message: t('error.default'),
				} as const;
			}
			if (!bindInvitationCodeData.data.success) {
				return bindInvitationCodeData.data;
			}
			const { data: loginWithInvitationCodeData, error: loginWithInvitationCodeError } = await tryCatch(
				loginWithInvitationCode(dto),
			);
			if (!loginWithInvitationCodeData?.data || loginWithInvitationCodeError) {
				return {
					success: false,
					code: CodeVerify.Invalid,
					message: t('error.default'),
				} as const;
			}
			return loginWithInvitationCodeData.data;
		},
	});
};
