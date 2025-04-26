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

export const get7DKOLAlertsArgsSchema = z.object({
	userMessage: z.string().nullable(),
	token_address: z.string(),
});

export const get7DSmartMoneyTradesArgsSchema = z.object({
	userMessage: z.string().nullable(),
	token_address: z.string(),
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

			const handlePreStreamWithToolCall = (
				data: AIResponseData<{ conv_id: string; token: string; msg_id: string }>,
				name: string,
			) => {
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
						`preStreamWithToolCall/${name}`,
					);
				} else {
					get().setStatus(ChatStatus.Error);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							error: data.msg,
							reasoning: null,
						});
					}
					get().internal_abort();
					set({ isPending: false }, false, `preStreamWithToolCall/${name}`);
				}
			};

			if (userMessage?.toolCalls) {
				for (const toolCall of userMessage.toolCalls) {
					switch (toolCall.id) {
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

								handlePreStreamWithToolCall(data, 'GetTokenInfo');
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

								handlePreStreamWithToolCall(data, 'GetTokenTrend');
							}
							break;
						case SupportedTool.Get7DKOLAlerts:
							{
								const args = get7DKOLAlertsArgsSchema.parse(JSON.parse(toolCall.function.arguments));
								const data = await request({
									requestMode: 'proxy-ai',
								})
									.post('api/v1/ai/chat/last_7d_kol_alerts', {
										json: {
											token_address: args.token_address,
										},
									})
									.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

								handlePreStreamWithToolCall(data, 'Get7DKOLAlerts');
							}
							break;
						case SupportedTool.Get7DSmartMoneyTrades:
							{
								const args = get7DSmartMoneyTradesArgsSchema.parse(JSON.parse(toolCall.function.arguments));
								const data = await request({
									requestMode: 'proxy-ai',
								})
									.post('api/v1/ai/chat/last_7d_smart_money_trades', {
										json: {
											token_address: args.token_address,
										},
									})
									.json<AIResponseData<{ conv_id: string; token: string; msg_id: string }>>();

								handlePreStreamWithToolCall(data, 'Get7DSmartMoneyTrades');
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
				} else {
					get().setStatus(ChatStatus.Error);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							error: data.msg,
							reasoning: null,
						});
					}
					get().internal_abort();
					set({ isPending: false }, false, 'preStream');
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
							threadId: data.data.conv_id,
						},
						false,
						'preStream',
					);
				} else {
					get().setStatus(ChatStatus.Error);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							error: data.msg,
							reasoning: null,
						});
					}
					get().internal_abort();
					set({ isPending: false }, false, 'preStream');
				}
			}
		},
		postStream: ({ get, set }) => {
			const convId = get().context?.conv_id;
			const lastMessage = get().getLastMessage();
			const currentContext = get().context;
			if (!convId) return;

			if (lastMessage?.toolCalls && currentContext) {
				for (const toolCall of lastMessage.toolCalls) {
					switch (toolCall.id) {
						case SupportedTool.GetTokenInfo:
						case SupportedTool.GetTokenTrend:
						case SupportedTool.Get7DKOLAlerts:
						case SupportedTool.Get7DSmartMoneyTrades:
							{
								set(
									{
										context: {
											...currentContext,
											conv_id: DEFAULT_THREAD_ID,
										},
										threadId: DEFAULT_THREAD_ID,
									},
									false,
									`postStreamWithToolCall/${toolCall.id}`,
								);
							}
							break;
					}
				}
				return;
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
