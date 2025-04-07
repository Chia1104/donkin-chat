import { z } from 'zod';

export const baseAddressSchema = z.object({
	balance_usd: z.string(),
	daily_return: z.string(),
	daily_return_rate: z.number(),
	win_rate: z.string(),
});

export const addressTokenPnlSchema = z.object({
	symbol: z.string(),
	amount: z.string(),
	price: z.string(),
	value: z.string(),
	return: z.string(),
	buy: z.number(),
	sell: z.number(),
});

export const addressDailyDataSchema = z.object({
	date: z.string(),
	balance_usd: z.string(),
	daily_return: z.string(),
	daily_return_rate: z.number(),
	token_pnls: z.array(addressTokenPnlSchema),
});

export const addressSchema = baseAddressSchema.extend({
	token_pnls: z.array(addressTokenPnlSchema),
	daily_data: z.array(addressDailyDataSchema),
});

export type Address = z.infer<typeof addressSchema>;
