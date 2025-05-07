import { z } from 'zod';

import { paginationSchema } from '@/utils/schemas';

export const tokenSchema = z
	.object({
		address: z.string(),
		chain_id: z.number(),
		symbol: z.string(),
		name: z.string(),
		decimals: z.number(),
		logo_uri: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		price: z.number(),
		daily_volume: z.number(),
		market_cap: z.number(),
		price_change_24h: z.number().nullish(),
		volume_24h: z.number().nullish(),
		liquidity: z.number(),
		created_at: z.string(),
		updated_at: z.string(),
		last_trade_time: z.string(),
		freeze_authority: z.string().nullish(),
		mint_authority: z.string().nullish(),
		permanent_delegate: z.string().nullish(),
		minted_at: z.string().nullish(),
		coingecko_id: z.string().nullish(),
	})
	.transform(data => ({
		...data,
		// 漲跌幅度
		change: data.price_change_24h ? data.price_change_24h / 100 : 0,
	}));

export const searchTokenSchema = z.object({
	address: z.string(),
	symbol: z.string(),
	name: z.string(),
	logo_uri: z.string().nullish(),
	market_cap: z.number(),
});

export const tokensSchema = z.array(tokenSchema);
export const searchTokensSchema = z.array(searchTokenSchema);

export const tokensPaginationSchema = paginationSchema.extend({
	data: tokensSchema,
});
export const searchTokensPaginationSchema = paginationSchema.extend({
	data: searchTokensSchema,
});

export const tokenPriceSchema = z.object({
	price: z.number(),
	price_change_24h: z.number(),
});

export const tokenSmartWalletCountSchema = z.object({
	smart_wallet_count: z.number(),
});

export const tokenMetadataSchema = z.object({
	address: z.string(),
	symbol: z.string(),
	name: z.string(),
	icon: z.string().nullish(),
	decimals: z.number(),
	holder: z.number(),
	creator: z.string(),
	create_tx: z.string(),
	created_time: z.number(),
	first_mint_tx: z.string(),
	first_mint_time: z.number(),
	metadata: z.object({
		name: z.string(),
		symbol: z.string(),
		description: z.string(),
		image: z.string(),
		twitter: z.string(),
		website: z.string(),
	}),
	mint_authority: z.unknown(),
	freeze_authority: z.unknown(),
	supply: z.string(),
	price: z.number(),
	volume_24h: z.number(),
	market_cap: z.number(),
	market_cap_rank: z.number(),
	price_change_24h: z.number(),
});

export type Token = z.infer<typeof tokenSchema>;
export type SearchToken = z.infer<typeof searchTokenSchema>;
export type TokensPagination = z.infer<typeof tokensPaginationSchema>;
export type SearchTokensPagination = z.infer<typeof searchTokensPaginationSchema>;
export type TokenPrice = z.infer<typeof tokenPriceSchema>;
export type TokenSmartWalletCount = z.infer<typeof tokenSmartWalletCountSchema>;
export type TokenMetadata = z.infer<typeof tokenMetadataSchema>;
