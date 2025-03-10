import { z } from 'zod';

export const loginNonceResponseValidator = z.object({
	nonce: z.string(),
});

export type LoginNonceResponse = z.infer<typeof loginNonceResponseValidator>;

export const loginResponseValidator = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseValidator>;

export interface LoginRequest {
	message: string;
	signature: string;
}
