import { z } from 'zod';

import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { Chain } from '@/libs/web3/enums/chain.enum';
import { numericString } from '@/utils/schemas';

import { Currency } from '../enums/currency.enum';

export const ohlcvRequestSchema = z.object({
	address: z.string().min(1),
	chain: z.nativeEnum(Chain).default(Chain.Solana),
	type: z.nativeEnum(IntervalFilter).default(IntervalFilter.FifteenMinutes),
	currency: z.nativeEnum(Currency).default(Currency.USD),
	time_from: numericString,
	time_to: numericString,
});

export type OhlcvRequest = z.infer<typeof ohlcvRequestSchema>;

export const ohlcvItemSchema = z.object({
	o: z.number(),
	h: z.number(),
	l: z.number(),
	c: z.number(),
	v: z.number(),
	unixTime: z.number(),
	address: z.string(),
	type: z.string(),
	currency: z.string(),
});

export const ohlcvItemDTOSchema = ohlcvItemSchema.transform(item => ({
	open: item.o,
	high: item.h,
	low: item.l,
	close: item.c,
	volume: item.v,
	unix: item.unixTime,
}));

export type OhlcvItem = z.infer<typeof ohlcvItemSchema>;
export type OhlcvItemDTO = z.infer<typeof ohlcvItemDTOSchema>;

export const ohlcvResponseSchema = z.object({
	items: z.array(ohlcvItemSchema),
});

export type OhlcvResponse = z.infer<typeof ohlcvResponseSchema>;
