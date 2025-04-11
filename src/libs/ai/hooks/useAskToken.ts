import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import { tokenInfoArgsSchema } from '@/stores/chat';

import { ChatStatus } from '../enums/chatStatus.enum';
import { SupportedTool } from '../enums/supportedTool.enum';

export const useAskToken = (token: string) => {
	const tAskMore = useTranslations('donkin.ask-more');
	const status = useChatStore(state => state.status);
	const handleSubmit = useChatStore(state => state.handleSubmit);

	return {
		askMore: [
			tAskMore('token-name.basic-info'),
			// tAskMore('token-name.price-analysis'),
			tAskMore('token-name.kol-order'),
			// tAskMore('token-name.smart-wallet'),
		],
		onAskMore: (item: string) => {
			if (status === ChatStatus.Streaming) {
				return;
			}
			switch (item) {
				case tAskMore('token-name.basic-info'):
					handleSubmit(
						tAskMore('token-name.basic-info-with-item', {
							item: token,
						}),
						{
							tools: [
								{
									id: SupportedTool.GetTokenInfo,
									function: {
										name: SupportedTool.GetTokenInfo,
										arguments: JSON.stringify(
											tokenInfoArgsSchema.parse({
												userMessage: tAskMore('token-name.basic-info-with-item', {
													item: token,
												}),
												token,
											}),
										),
									},
								},
							],
						},
					);
					break;
				case tAskMore('token-name.kol-order'):
					handleSubmit(
						tAskMore('token-name.kol-order-with-item', {
							item: token,
						}),
						{
							tools: [
								{
									id: SupportedTool.GetTokenTrend,
									function: {
										name: SupportedTool.GetTokenTrend,
										arguments: JSON.stringify(
											tokenInfoArgsSchema.parse({
												userMessage: tAskMore('token-name.kol-order-with-item', {
													item: token,
												}),
												token,
											}),
										),
									},
								},
							],
						},
					);
					break;
			}
		},
	};
};
