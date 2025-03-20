import ky from 'ky';
import type { Options } from 'ky';
import { isObject } from 'lodash-es';

import type { SmoothingParams } from '@/types/llm';

import { env } from '../env';
import { fetchEventSource } from './fetchEventSource';

type RequestOptions = {
	requestMode?: 'proxy' | 'self-api' | 'external';
} & Options;

type SSEFinishType = 'done' | 'error' | 'abort';

export type OnFinishHandler = (
	text: string,
	context: {
		reasoning?: string;
		type?: SSEFinishType;
	},
) => Promise<void>;

export interface MessageTextChunk {
	text: string;
	type: 'text';
}

export interface MessageReasoningChunk {
	text: string;
	type: 'reasoning';
}

export interface FetchSSEOptions {
	fetcher?: typeof fetch;
	onAbort?: (text: string) => Promise<void>;
	/**
	 * TODO: define the type of the error
	 */
	onErrorHandle?: (error: any) => void;
	onFinish?: OnFinishHandler;
	onMessageHandle?: (chunk: MessageTextChunk | MessageReasoningChunk) => void;
	smoothing?: SmoothingParams | boolean;
}

export type RequestMode = 'proxy' | 'self-api' | 'external';

const START_ANIMATION_SPEED = 4;

const END_ANIMATION_SPEED = 15;

const getPrefixedUrl = (requestMode?: RequestMode) => {
	const IS_SERVER = typeof window === 'undefined';
	switch (requestMode) {
		case 'proxy':
			return !IS_SERVER ? '/proxy-api' : env.NEXT_PUBLIC_APP_API_HOST;
		case 'self-api':
			return !IS_SERVER ? '/' : env.NEXT_PUBLIC_APP_API_HOST;
		case 'external':
			return env.NEXT_PUBLIC_APP_API_HOST;
		default:
			return !IS_SERVER ? '/' : env.NEXT_PUBLIC_APP_API_HOST;
	}
};

export const withPrefixedUrl = (url: string, requestMode?: RequestMode) => {
	// remove trailing slash
	const prefixedUrl = getPrefixedUrl(requestMode).replace(/\/$/, '');
	// remove leading slash
	const _url = url.replace(/^\//, '');
	return `${prefixedUrl}/${_url}`;
};

export const request = (defaultOptions?: RequestOptions) => {
	const { requestMode = 'proxy' } = defaultOptions || {};

	return ky.extend({
		timeout: 10_000,
		credentials: 'include',
		hooks: {
			beforeRequest: [
				request => {
					request.headers.set('Content-Type', 'application/json');
				},
			],
		},
		prefixUrl: getPrefixedUrl(requestMode),
		...defaultOptions,
	});
};

const createSmoothMessage = (params: { onTextUpdate: (delta: string, text: string) => void; startSpeed?: number }) => {
	const { startSpeed = START_ANIMATION_SPEED } = params;

	let buffer = '';
	// why use queue: https://shareg.pt/GLBrjpK
	const outputQueue: string[] = [];
	let isAnimationActive = false;
	let animationFrameId: number | null = null;

	// when you need to stop the animation, call this function
	const stopAnimation = () => {
		isAnimationActive = false;
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	};

	// define startAnimation function to display the text in buffer smooth
	// when you need to start the animation, call this function
	const startAnimation = (speed = startSpeed) =>
		new Promise<void>(resolve => {
			if (isAnimationActive) {
				resolve();
				return;
			}

			isAnimationActive = true;

			const updateText = () => {
				// 如果动画已经不再激活，则停止更新文本
				if (!isAnimationActive) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					cancelAnimationFrame(animationFrameId!);
					animationFrameId = null;
					resolve();
					return;
				}

				// 如果还有文本没有显示
				// 检查队列中是否有字符待显示
				if (outputQueue.length > 0) {
					// 从队列中获取前 n 个字符（如果存在）
					const charsToAdd = outputQueue.splice(0, speed).join('');
					buffer += charsToAdd;

					// 更新消息内容，这里可能需要结合实际情况调整
					params.onTextUpdate(charsToAdd, buffer);
				} else {
					// 当所有字符都显示完毕时，清除动画状态
					isAnimationActive = false;
					animationFrameId = null;
					resolve();
					return;
				}

				animationFrameId = requestAnimationFrame(updateText);
			};

			animationFrameId = requestAnimationFrame(updateText);
		});

	const pushToQueue = (text: string) => {
		outputQueue.push(...text.split(''));
	};

	return {
		isAnimationActive,
		isTokenRemain: () => outputQueue.length > 0,
		pushToQueue,
		startAnimation,
		stopAnimation,
	};
};

export const streamingRequest = async (url: string, options: RequestInit & FetchSSEOptions = {}) => {
	let triggerOnMessageHandler = false;

	let finishedType: SSEFinishType = 'done';
	let response!: Response;

	const { smoothing } = options;

	const textSmoothing = typeof smoothing === 'boolean' ? smoothing : smoothing?.text;
	const smoothingSpeed = isObject(smoothing) ? smoothing.speed : undefined;

	let output = '';
	const textController = createSmoothMessage({
		onTextUpdate: (delta, text) => {
			output = text;
			options.onMessageHandle?.({ text: delta, type: 'text' });
		},
		startSpeed: smoothingSpeed,
	});

	let thinking = '';
	const thinkingController = createSmoothMessage({
		onTextUpdate: (delta, text) => {
			thinking = text;
			options.onMessageHandle?.({ text: delta, type: 'reasoning' });
		},
		startSpeed: smoothingSpeed,
	});

	await fetchEventSource(url, {
		body: options.body,
		fetch: options?.fetcher,
		headers: options.headers as Record<string, string>,
		method: options.method,
		onerror: error => {
			if ((error as TypeError).name === 'AbortError') {
				finishedType = 'abort';
				void options?.onAbort?.(output);
				textController.stopAnimation();
			} else {
				finishedType = 'error';

				options.onErrorHandle?.(
					error.type
						? error
						: {
								body: {
									message: error.message,
									name: error.name,
									stack: error.stack,
								},
								message: error.message,
								type: 'Unexpected error',
							},
				);
				return;
			}
		},
		onmessage: ev => {
			triggerOnMessageHandler = true;
			let data;
			try {
				data = JSON.parse(ev.data);
			} catch (e) {
				console.warn('parse error:', e);
				options.onErrorHandle?.({
					body: {
						context: {
							chunk: ev.data,
							error: { message: (e as Error).message, name: (e as Error).name },
						},
						message: 'chat response streaming chunk parse error, please contact your API Provider to fix it.',
					},
					message: 'parse error',
					type: 'StreamChunkError',
				});

				return;
			}

			switch (ev.event) {
				case 'error': {
					finishedType = 'error';
					options.onErrorHandle?.(data);
					break;
				}

				case 'text': {
					if (textSmoothing) {
						textController.pushToQueue(data as string);

						if (!textController.isAnimationActive) void textController.startAnimation();
					} else {
						output += data;
						options.onMessageHandle?.({ text: data, type: 'text' });
					}

					break;
				}
				case 'reasoning': {
					if (textSmoothing) {
						thinkingController.pushToQueue(data as string);

						if (!thinkingController.isAnimationActive) void thinkingController.startAnimation();
					} else {
						thinking += data;
						options.onMessageHandle?.({ text: data, type: 'reasoning' });
					}

					break;
				}
			}
		},
		onopen: async res => {
			response = res.clone();
			// 如果不 ok 说明有请求错误
			if (!response.ok) {
				throw await response.text();
			}
		},
		signal: options.signal,
	});

	// only call onFinish when response is available
	// so like abort, we don't need to call onFinish
	if (response) {
		textController.stopAnimation();

		if (response.ok) {
			// if there is no onMessageHandler, we should call onHandleMessage first
			if (!triggerOnMessageHandler) {
				output = await response.clone().text();
				options.onMessageHandle?.({ text: output, type: 'text' });
			}

			if (textController.isTokenRemain()) {
				await textController.startAnimation(END_ANIMATION_SPEED);
			}

			await options?.onFinish?.(output, {
				reasoning: thinking ? thinking : undefined,
				type: finishedType,
			});
		}
	}

	return response;
};
