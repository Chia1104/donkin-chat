import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import { get7DKOLAlertsArgsSchema, get7DSmartMoneyTradesArgsSchema } from '@/stores/chat';

import { SupportedTool } from '../enums/supportedTool.enum';

export const useAskTokenTrade = (token_address: string) => {
	const tAskMore = useTranslations('donkin.ask-more.kol-order');
	const isPending = useChatStore(state => state.isPending);
	const handleSubmit = useChatStore(state => state.handleSubmit);

	return {
		askMore: [tAskMore('smart-wallet'), tAskMore('kol-order')],
		onAskMore: (item: string) => {
			if (isPending) {
				return;
			}
			switch (item) {
				case tAskMore('smart-wallet'):
					handleSubmit(tAskMore('smart-wallet'), {
						tools: [
							{
								id: SupportedTool.Get7DSmartMoneyTrades,
								function: {
									name: SupportedTool.Get7DSmartMoneyTrades,
									arguments: JSON.stringify(
										get7DSmartMoneyTradesArgsSchema.parse({
											userMessage: tAskMore('smart-wallet'),
											token_address,
										}),
									),
								},
							},
						],
					});
					break;
				case tAskMore('kol-order'):
					handleSubmit(tAskMore('kol-order'), {
						tools: [
							{
								id: SupportedTool.Get7DKOLAlerts,
								function: {
									name: SupportedTool.Get7DKOLAlerts,
									arguments: JSON.stringify(
										get7DKOLAlertsArgsSchema.parse({
											userMessage: tAskMore('kol-order'),
											token_address,
										}),
									),
								},
							},
						],
					});
					break;
			}
		},
	};
};
