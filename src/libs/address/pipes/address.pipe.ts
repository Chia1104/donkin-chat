import { z } from 'zod';

export const baseAddressSchema = z.object({
	balance_usd: z.number(),
	daily_return: z.number(),
	daily_return_rate: z.number(),
	win_rate: z.number().optional(),
});

export const addressTokenPnlSchema = z.object({
	symbol: z.string(),
	url: z.string(),
	amount: z.number(),
	price: z.number(),
	value: z.number(),
	return: z.number(),
	buy: z.number(),
	sell: z.number(),
});

export const addressDailyDataSchema = z.object({
	date: z.string(),
	balance_usd: z.number(),
	daily_return: z.number(),
	daily_return_rate: z.number(),
	token_pnls: z.array(addressTokenPnlSchema),
});

export const addressSchema = baseAddressSchema.extend({
	token_pnls: z.array(addressTokenPnlSchema),
	daily_data: z.array(addressDailyDataSchema),
});

export type Address = z.infer<typeof addressSchema>;
