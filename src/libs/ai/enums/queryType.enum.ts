export const QueryType = {
	Tokens: 'tokens',
	Heatmap: 'heatmap',
} as const;

export type QueryType = (typeof QueryType)[keyof typeof QueryType];
