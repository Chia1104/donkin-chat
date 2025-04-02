import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat/store';
import dayjs from '@/utils/dayjs';
import { uuid } from '@/utils/uuid';

import { ChatStatus } from '../enums/chatStatus.enum';
import type { TokenInfo } from '../pipes/token.pipe';
import { getTokenInfo } from '../resources/chat.resource';

interface GetTokenInfoRequest {
	threadId: string;
	userMessage: string;
	token: string;
}

export const useGetTokenInfo = (
	options?: Partial<
		Omit<
			UseMutationOptions<TokenInfo, Error, GetTokenInfoRequest, { userId: string; assistantId: string }>,
			'mutationFn'
		>
	>,
) => {
	const t = useTranslations('donkin.ask-more.token-name');
	const { pushMessage, setStatus, updateLastMessageContent, deleteLastMessage, updateMessage, getLastMessage } =
		useChatStore(state => state);

	return useMutation<TokenInfo, Error, GetTokenInfoRequest, { userId: string; assistantId: string }>({
		...options,
		mutationFn: dto => getTokenInfo(dto.token),
		onMutate: dto => {
			const userId = uuid();
			const assistantId = uuid();

			const currentMessage = getLastMessage();

			if (currentMessage?.error) {
				deleteLastMessage();
			}

			void pushMessage([
				{
					role: 'user',
					content: t('basic-info-with-item', {
						item: dto.token,
					}),
					createdAt: dayjs().toDate(),
					id: userId,
					parentId: null,
					reasoning: null,
					threadId: dto.threadId,
				},
				{
					role: 'assistant',
					content: '',
					createdAt: dayjs().toDate(),
					id: assistantId,
					parentId: userId,
					reasoning: null,
					threadId: dto.threadId,
				},
			]);
			setStatus(ChatStatus.Streaming);

			return {
				userId,
				assistantId,
			};
		},
		onSuccess: data => {
			updateLastMessageContent(data.token_info);
			setStatus(ChatStatus.Success);
		},
		onError: (error, dto, context) => {
			setStatus(ChatStatus.Error);
			if (context?.assistantId) {
				void updateMessage(context.assistantId, {
					error: error.message,
				});
			}
		},
	});
};
