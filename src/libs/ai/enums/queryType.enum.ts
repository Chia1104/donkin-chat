export const QueryType = {
	AiSignal: 'ai-signal',
	WhaleRanking: 'whale-ranking',
	SmartRankings: 'smart-rankings',
	HeatMap: 'heat-map',
} as const;

export type QueryType = (typeof QueryType)[keyof typeof QueryType];
