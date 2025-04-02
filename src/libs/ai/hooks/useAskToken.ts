import { useTranslations } from 'next-intl';

import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useGetTokenInfo } from '@/libs/ai/hooks/useGetTokenInfo';
import { useChatStore } from '@/stores/chat/store';

import { ChatStatus } from '../enums/chatStatus.enum';
import { useGetTokenTrends } from './useGetTokenTrends';

export const useAskToken = (token: string) => {
	const tAskMore = useTranslations('donkin.ask-more');
	const { mutate: getTokenInfo } = useGetTokenInfo();
	const { mutate: getTokenTrends } = useGetTokenTrends();
	const [searchParams] = useAISearchParams();
	const status = useChatStore(state => state.status);

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
					getTokenInfo({
						threadId: searchParams.threadId,
						userMessage: item,
						token,
					});
					break;
				case tAskMore('token-name.kol-order'):
					getTokenTrends({
						threadId: searchParams.threadId,
						userMessage: item,
						token,
					});
					break;
			}
		},
	};
};
