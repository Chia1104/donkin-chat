import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import dayjs from '@/utils/dayjs';
import { uuid } from '@/utils/uuid';

import { ChatStatus } from '../enums/chatStatus.enum';
import { SupportedTool } from '../enums/supportedTool.enum';
import type { TokenTrends } from '../pipes/token.pipe';
import { getTokenTrends } from '../resources/chat.resource';

interface GetTokenInfoRequest {
	threadId: string;
	userMessage: string;
	token: string;
}

/**
 * @deprecated 請使用 `useChatStore` 中的 `handleSubmit` 並搭配 `SupportedTool.GetTokenTrend`
 *
 * @example
 * ```ts
 * handleSubmit(
 *   tAskMore('token-name.kol-order-with-item', {
 *     item: token,
 *   }),
 *   {
 *     tools: [
 *       {
 *         id: SupportedTool.GetTokenTrend,
 *         function: {
 *           name: SupportedTool.GetTokenTrend,
 *           arguments: JSON.stringify(
 *             tokenInfoArgsSchema.parse({
 *               userMessage: tAskMore('token-name.kol-order-with-item', {
 *                 item: token,
 *               }),
 *               token,
 *             }),
 *           ),
 *         },
 *       },
 *     ],
 *   },
 * );
 * ```
 */
export const useGetTokenTrends = (
	options?: Partial<
		Omit<
			UseMutationOptions<TokenTrends | null, Error, GetTokenInfoRequest, { userId: string; assistantId: string }>,
			'mutationFn'
		>
	>,
) => {
	const t = useTranslations('donkin.ask-more.token-name');
	const { pushMessage, setStatus, updateLastMessageContent, deleteLastMessage, updateMessage, getLastMessage } =
		useChatStore(state => state);

	return useMutation<TokenTrends | null, Error, GetTokenInfoRequest, { userId: string; assistantId: string }>({
		...options,
		mutationFn: dto => getTokenTrends(dto.token),
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
					content: t('kol-order-with-item', {
						item: dto.token,
					}),
					createdAt: dayjs().toDate(),
					id: userId,
					parentId: null,
					reasoning: null,
					threadId: dto.threadId,
					toolCalls: [
						{
							id: SupportedTool.GetTokenTrend,
							function: { name: SupportedTool.GetTokenTrend, arguments: '' },
						},
					],
				},
				{
					role: 'assistant',
					content: '',
					createdAt: dayjs().toDate(),
					id: assistantId,
					parentId: userId,
					reasoning: null,
					threadId: dto.threadId,
					toolCalls: [
						{
							id: SupportedTool.GetTokenTrend,
							function: { name: SupportedTool.GetTokenTrend, arguments: '' },
						},
					],
				},
			]);
			setStatus(ChatStatus.Streaming);

			return {
				userId,
				assistantId,
			};
		},
		onSuccess: data => {
			setStatus(ChatStatus.Success);

			if (!data) {
				updateLastMessageContent(t('kol-order-error'));
				return;
			}
			updateLastMessageContent(data.summarize ?? data.kol_opinions ?? '');
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
