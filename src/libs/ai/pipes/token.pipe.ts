import { z } from 'zod';

export const tokenInfoSchema = z.object({
	token_info: z.string(),
});

export type TokenInfo = z.infer<typeof tokenInfoSchema>;
