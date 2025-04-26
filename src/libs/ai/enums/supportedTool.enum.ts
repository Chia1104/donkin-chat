export const SupportedTool = {
	GetTokenInfo: 'get_token_info',
	GetTokenTrend: 'get_token_trend',
	Get7DKOLAlerts: 'get_7d_kol_alerts',
	Get7DSmartMoneyTrades: 'get_7d_smart_money_trades',
} as const;

export type SupportedTool = (typeof SupportedTool)[keyof typeof SupportedTool];
