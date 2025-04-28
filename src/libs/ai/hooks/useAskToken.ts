import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import { tokenInfoArgsSchema } from '@/stores/chat';

import { SupportedTool } from '../enums/supportedTool.enum';

export const useAskToken = (token: string) => {
	const tAskMore = useTranslations('donkin.ask-more');
	const handleSubmit = useChatStore(state => state.handleSubmit, 'useAskToken');

	return {
		askMore: [
			tAskMore('token-name.basic-info'),
			// tAskMore('token-name.price-analysis'),
			tAskMore('token-name.kol-order'),
			// tAskMore('token-name.smart-wallet'),
		],
		onAskMore: (item: string) => {
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
