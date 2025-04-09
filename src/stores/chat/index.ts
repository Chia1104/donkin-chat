'use client';

import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import { processStreamEvents } from '@/libs/ai/services/chatMessageProcessor';
import type { AIResponseData } from '@/types/request';
import { isAbortError } from '@/utils/is';
import { withPrefixedUrl, request } from '@/utils/request';

import { defineChatStore } from './store';

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
						console.info('Stream processing was aborted');
						return;
					}
					get().setStatus(ChatStatus.Error);
					const lastMessage = get().getLastMessage();
					if (lastMessage) {
						get().updateMessage(lastMessage.id, {
							error: message,
						});
					}
				},
				onFinishStepPart: () => {
					get().setStatus(ChatStatus.Success);
				},
				onStartStepPart: () => {
					get().setStatus(ChatStatus.Streaming);
				},
				onMessageStart(convId) {
					set({ threadId: convId }, false, 'messageProcessor');
				},
			});
		} catch (error) {
			if (isAbortError(error)) {
				console.info('Stream processing was aborted');
				return;
			}
			console.error('Error processing stream:', error);
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
			if (!convId || convId === 'inbox') {
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
							context: { conv_id: data.data.conv_id, token: data.data.token, locale: locale ?? 'zh-CN' },
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
						{ context: { conv_id: data.data.conv_id, token: data.data.token, locale: locale ?? 'zh-CN' } },
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
