export const SupportedTool = {
	GetTokenInfo: 'get_token_info',
	GetTokenTrend: 'get_token_trend',
} as const;

export type SupportedTool = (typeof SupportedTool)[keyof typeof SupportedTool];
