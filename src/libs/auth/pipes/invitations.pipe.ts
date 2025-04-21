import { z } from 'zod';

import type { CodeVerify } from '../enums/codeVerify.enum';

export const verifyInvitationCodeResponseSchema = z.object({
	id: z.number(),
	code: z.string(),
	is_used: z.boolean(),
	created_at: z.string(),
	wallet_address: z.string().optional(),
	used_at: z.string().optional(),
	login_count: z.number().optional(),
});

export type VerifyInvitationCodeResponse = z.infer<typeof verifyInvitationCodeResponseSchema>;

export const loginWithInvitationCodeResponseSchema = z.object({
	token: z.string(),
	wallet_address: z.string(),
	is_bound: z.boolean(),
	login_count: z.number(),
});

export type LoginWithInvitationCodeResponse = z.infer<typeof loginWithInvitationCodeResponseSchema>;

export const bindInvitationCodeSchema = z.object({
	code: z.string(),
	wallet_address: z.string(),
});

export type BindInvitationCode = z.infer<typeof bindInvitationCodeSchema>;

export type BindInvitationCodeResponse =
	| {
			success: true;
			code: typeof CodeVerify.Matched;
			message: string;
	  }
	| {
			success: false;
			code: typeof CodeVerify.Invalid | typeof CodeVerify.Unmatched;
			message: string;
	  };
