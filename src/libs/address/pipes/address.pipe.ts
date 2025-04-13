import { z } from 'zod';

import dayjs from '@/utils/dayjs';

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
	return: z.number().optional(),
	buy: z.number(),
	sell: z.number(),
});

export const dailyTokenPnlSchema = z.object({
	symbol: z.string(),
	url: z.string(),
	return: z.number().optional(),
	buy: z.number().optional(),
	sell: z.number().optional(),
});

export type DailyTokenPnl = z.infer<typeof dailyTokenPnlSchema>;

export const addressDailyDataSchema = z.object({
	date: z.string(),
	balance_usd: z.number(),
	daily_return: z.number(),
	daily_return_rate: z.number(),
	token_pnls: z.array(dailyTokenPnlSchema).nullish(),
});

export const addressSchema = baseAddressSchema.extend({
	token_pnls: z.array(addressTokenPnlSchema).nullish(),
	daily_data: z
		.array(addressDailyDataSchema)
		.transform(data => data.sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))),
});

export type Address = z.infer<typeof addressSchema>;
