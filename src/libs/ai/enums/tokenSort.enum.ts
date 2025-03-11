export const TokenSort = {
	Hot: 'hot',
	UpTime: 'upTime',
	MarketCap: 'marketCap',
	Change: 'change',
} as const;

export type TokenSort = (typeof TokenSort)[keyof typeof TokenSort];
