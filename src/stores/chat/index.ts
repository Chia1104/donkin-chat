'use client';

import { z } from 'zod';

import { DEFAULT_THREAD_ID } from '@/libs/ai/constants';
import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import { SupportedTool } from '@/libs/ai/enums/supportedTool.enum';
import { processStreamEvents } from '@/libs/ai/services/chatMessageProcessor';
import type { AIResponseData } from '@/types/request';
import { env } from '@/utils/env';
import { isAbortError } from '@/utils/is';
import { logger } from '@/utils/logger';
import { withPrefixedUrl, request } from '@/utils/request';

import { defineChatStore } from './store';

export const tokenInfoArgsSchema = z.object({
	userMessage: z.string().nullable(),
	token: z.string(),
});

const { ChatStoreProvider, useChatStore, ChatStoreContext, creator } = defineChatStore({
	async messageProcessor({ get, response, set }) {
		try {
			await processStreamEvents({
				stream: response.stream,
				onTextPart: part => {
					get().internal_setStream(part);
					get().updateLastMessageContent(part);
				},
				onErrorPart: (message, error) => {
					if (isAbortError(error)) {
						logger('Stream processing was aborted', { type: 'info' });
						return;
					}
					get().setStatus(ChatStatus.Error);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							error: message,
							reasoning: null,
						});
					}
					get().internal_abort();
					set({ isPending: false }, false, 'messageProcessor');
				},
				onFinishStepPart: () => {
					get().setStatus(ChatStatus.Success);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							reasoning: null,
						});
					}
					set({ isPending: false }, false, 'messageProcessor');
				},
				onStartStepPart: () => {
					get().setStatus(ChatStatus.Streaming);
					set({ isPending: true }, false, 'messageProcessor');
				},
				onMessageStart(convId) {
					set({ threadId: convId }, false, 'messageProcessor');
				},
				onSearchingStart(content) {
					const lastMessage = get().getLastMessage();
					get().setStatus(ChatStatus.Searching);
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							reasoning: {
								content: content.replace(/^\n/, ''),
							},
						});
					}
				},
				onSearchingEnd(content) {
					const lastMessage = get().getLastMessage();
					get().setStatus(ChatStatus.Streaming);
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							reasoning: {
								content: `${lastMessage.reasoning?.content}${content}`,
							},
						});
					}
				},
			});
		} catch (error) {
			if (isAbortError(error)) {
				logger('Stream processing was aborted', { type: 'info' });
				return;
			}
			logger(['Error processing stream:', error], { type: 'error' });
			get().setStatus(ChatStatus.Error);
			const lastMessage = get().getLastMessage();
			if (lastMessage) {
				get().updateMessage(lastMessage.id, {
					error: error instanceof Error ? error.message : 'Unknown error occurred',
				});
			}
		}
	},
	initState: {
		context: {
			conv_id: '',
			token: '',
			locale: 'zh-CN',
		},
		endpoint: withPrefixedUrl('api/v1/ai/chat/stream', 'proxy-ai'),
		streamRequestInit: ({ get }) => {
			return {
				searchParams: {
					conv_id: get().context?.conv_id ?? '',
					token: get().context?.token ?? '',
				},
				method: 'GET',
			};
		},
		preStream: async ({ get, set }) => {
			const convId = get().context?.conv_id;
			const userMessage = get().getLatestUserMessage();
			const locale = get().context?.locale;

			if (userMessage?.toolCalls) {
				for (const toolCall of userMessage.toolCalls) {
					switch (toolCall.function.name) {
						case SupportedTool.GetTokenInfo:
							{
								const args = tokenInfoArgsSchema.parse(JSON.parse(toolCall.function.arguments));
								const data = await request({
									requestMode: 'proxy-ai',
								})
									.post('api/v1/ai/chat/token_info', {
										json: {
											token: args.token,
										},
									})
									.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

								if (data.code === 200) {
									set(
										{
											context: {
												conv_id: data.data.conv_id,
												token: data.data.token,
												locale: locale ?? env.NEXT_PUBLIC_DEFAULT_LOCALE,
											},
											threadId: data.data.conv_id,
										},
										false,
										'preStreamWithToolCall/GetTokenInfo',
									);
								}
							}
							break;
						case SupportedTool.GetTokenTrend:
							{
								const args = tokenInfoArgsSchema.parse(JSON.parse(toolCall.function.arguments));
								const data = await request({
									requestMode: 'proxy-ai',
								})
									.post('api/v1/ai/chat/token_trends', {
										json: {
											token: args.token,
										},
									})
									.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

								if (data.code === 200) {
									set(
										{
											context: {
												conv_id: data.data.conv_id,
												token: data.data.token,
												locale: locale ?? env.NEXT_PUBLIC_DEFAULT_LOCALE,
											},
											threadId: data.data.conv_id,
										},
										false,
										'preStreamWithToolCall/GetTokenTrend',
									);
								}
							}
							break;
					}
				}
				return;
			}

			if (!convId || convId === DEFAULT_THREAD_ID) {
				const data = await request({
					requestMode: 'proxy-ai',
				})
					.post('api/v1/ai/chat/start', {
						json: {
							conv_id: '',
							msg: userMessage?.content,
							lang: locale,
							stream: true,
							data: {},
						},
					})
					.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

				if (data.code === 200) {
					set(
						{
							context: {
								conv_id: data.data.conv_id,
								token: data.data.token,
								locale: locale ?? env.NEXT_PUBLIC_DEFAULT_LOCALE,
							},
							threadId: data.data.conv_id,
						},
						false,
						'preStream',
					);
				}
			} else {
				const data = await request({
					requestMode: 'proxy-ai',
				})
					.post('api/v1/ai/chat/start', {
						json: {
							conv_id: convId,
							msg: userMessage?.content,
							lang: locale,
							stream: true,
							data: {},
						},
					})
					.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

				if (data.code === 200) {
					set(
						{
							context: {
								conv_id: data.data.conv_id,
								token: data.data.token,
								locale: locale ?? env.NEXT_PUBLIC_DEFAULT_LOCALE,
							},
						},
						false,
						'preStream',
					);
				}
			}
		},
		onCancel: async ({ get }) => {
			const convId = get().context?.conv_id;
			if (!convId) return;

			await request({
				requestMode: 'proxy-ai',
			}).post('api/v1/ai/chat/stop', {
				json: {
					conv_id: convId,
					data: {},
				},
			});
		},
	},
});

export { ChatStoreProvider, useChatStore, ChatStoreContext, creator };
