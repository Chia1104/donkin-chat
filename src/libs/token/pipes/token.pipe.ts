import { z } from 'zod';

export const tokenSchema = z.object({
	address: z.string(),
	chain_id: z.number(),
	symbol: z.string(),
	name: z.string(),
	decimals: z.number(),
	logo_uri: z.string().nullable(),
	tags: z.array(z.string()).nullable(),
	price: z.number(),
	daily_volume: z.number(),
	market_cap: z.number(),
	price_change_24h: z.number(),
	volume_24h: z.number(),
	liquidity: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	last_trade_time: z.string(),
	freeze_authority: z.string().nullable(),
	mint_authority: z.string().nullable(),
	permanent_delegate: z.string().nullable(),
	minted_at: z.string().nullable(),
	coingecko_id: z.string().nullable(),
});

export const tokensSchema = z.array(tokenSchema);

export type Token = z.infer<typeof tokenSchema>;
