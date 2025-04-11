import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { tokenInfoArgsSchema } from '@/stores/chat';
import { useChatStore } from '@/stores/chat';
import dayjs from '@/utils/dayjs';
import { uuid } from '@/utils/uuid';

import { ChatStatus } from '../enums/chatStatus.enum';
import { SupportedTool } from '../enums/supportedTool.enum';
import type { TokenInfo } from '../pipes/token.pipe';
import { getTokenInfo } from '../resources/chat.resource';

interface GetTokenInfoRequest {
	threadId: string;
	userMessage: string;
	token: string;
}

/**
 * @deprecated 請使用 `useChatStore` 中的 `handleSubmit` 並搭配 `SupportedTool.GetTokenInfo`
 *
 * @example
 * ```ts
 * handleSubmit(
 *   tAskMore('token-name.basic-info-with-item', {
 *     item: token,
 *   }),
 *   {
 *     tools: [
 *       {
 *         id: SupportedTool.GetTokenInfo,
 *         function: {
 *           name: SupportedTool.GetTokenInfo,
 *           arguments: JSON.stringify(
 *             tokenInfoArgsSchema.parse({
 *               userMessage: tAskMore('token-name.basic-info-with-item', {
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

			const args = tokenInfoArgsSchema.parse({
				userMessage: t('basic-info-with-item', {
					item: dto.token,
				}),
				token: dto.token,
			});

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
					toolCalls: [
						{
							id: SupportedTool.GetTokenInfo,
							function: { name: SupportedTool.GetTokenInfo, arguments: JSON.stringify(args) },
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
							id: SupportedTool.GetTokenInfo,
							function: { name: SupportedTool.GetTokenInfo, arguments: JSON.stringify(args) },
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
