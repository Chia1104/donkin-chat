export const TokenSort = {
	Hot: 'hot',
	UpTime: 'created_at',
	MarketCap: 'market_cap',
	Change: 'price_change_24h',
} as const;

export type TokenSort = (typeof TokenSort)[keyof typeof TokenSort];
