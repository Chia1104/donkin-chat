import { isAbortError } from '@/utils/is';

import { ChatEvent, ChatEventType } from '../enums/chatEvent.enum';
import {
	messageStartSchema,
	messageSchema,
	thinkingSchema,
	heartbeatSchema,
	messageEndSchema,
} from '../pipes/chatEvent.pipe';

interface StreamEventProcessor {
	onTextPart?: (part: string) => void;
	onErrorPart?: (message: string, error?: Error) => void;
	onStartStepPart?: () => void;
	onFinishStepPart?: () => void;
	onThinking?: (content: string) => void;
	onMessageStart?: (convId: string, msgId: string) => void;
	onMessageEnd?: (convId: string, msgId: string, content?: string) => void;
}

/**
 * 處理特定格式的 SSE 流
 * 支援 message_start, heartbeat, thinking, message, message_end 等事件
 */
export async function processStreamEvents({
	stream,
	onTextPart,
	onErrorPart,
	onStartStepPart,
	onFinishStepPart,
	onThinking,
	onMessageStart,
	onMessageEnd,
}: {
	stream: ReadableStream<Uint8Array>;
} & StreamEventProcessor): Promise<void> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = '';
	let accumulatedText = '';
	// 檢測數據格式類型
	let formatDetected = false;
	let isServerSentEvent = true; // 默認假設是 SSE 格式
	let customDelimiter = '\n\n'; // 默認分隔符

	try {
		onStartStepPart?.();

		// 分析收到的原始數據格式
		let rawDataReceived = false;

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			// 檢查原始數據
			if (!rawDataReceived && value) {
				rawDataReceived = true;
				const rawText = decoder.decode(value, { stream: false });

				// 檢測數據格式類型
				if (!formatDetected) {
					formatDetected = true;

					// 檢查是否是 SSE 格式
					if (rawText.includes('event:') || rawText.includes('event: ')) {
						isServerSentEvent = true;
						// 檢查分隔符
						if (rawText.includes('\r\n\r\n')) {
							customDelimiter = '\r\n\r\n';
						} else {
							customDelimiter = '\n\n';
						}
					} else {
						// 可能是原始 JSON 或其他格式
						isServerSentEvent = false;
					}
				}
			}

			const chunk = decoder.decode(value, { stream: true });
			buffer += chunk;

			// 根據檢測到的格式處理數據
			if (isServerSentEvent) {
				// SSE 格式處理
				// 嘗試不同的分隔符
				const eventChunks = buffer.split(customDelimiter);

				buffer = eventChunks.pop() || '';

				for (const chunk of eventChunks) {
					accumulatedText = processSSEChunk(
						chunk,
						onTextPart,
						onErrorPart,
						onThinking,
						onMessageStart,
						onMessageEnd,
						onFinishStepPart,
						accumulatedText,
					);
				}
			} else {
				throw new Error('未知的數據格式');
			}
		}
	} catch (error) {
		if (!isAbortError(error)) {
			console.error('處理流時發生錯誤:', error);
		}
		onErrorPart?.(error instanceof Error ? error.message : 'Unknown error', error instanceof Error ? error : undefined);
	} finally {
		reader.releaseLock();
	}
}

/**
 * 處理 SSE 格式的事件塊
 */
function processSSEChunk(
	chunk: string,
	onTextPart: ((part: string) => void) | undefined,
	onErrorPart: ((message: string, error?: Error) => void) | undefined,
	onThinking: ((content: string) => void) | undefined,
	onMessageStart: ((convId: string, msgId: string) => void) | undefined,
	onMessageEnd: ((convId: string, msgId: string, content?: string) => void) | undefined,
	onFinishStepPart: (() => void) | undefined,
	accumulatedText: string,
): string {
	if (!chunk.trim()) return accumulatedText;

	// 檢查是否為新的 ping 格式
	if (chunk.trim().startsWith(': ping')) {
		// 將 ping 視為 heartbeat 事件處理
		try {
			// 建立一個類似 heartbeat 的數據結構
			const heartbeatData = { type: ChatEventType.System };
			// 模擬 heartbeat 事件的處理流程，但不執行任何回調
			heartbeatSchema.parse(heartbeatData);
		} catch (error) {
			console.warn('處理 ping 格式失敗:', error);
		}
		return accumulatedText;
	}

	// 嘗試使用不同的行分隔符
	let eventLines = chunk.split('\n');
	if (eventLines.length < 2) {
		eventLines = chunk.split('\r\n');
	}

	if (eventLines.length < 2) {
		console.warn('事件格式不正確，缺少數據行:', chunk);
		return accumulatedText;
	}

	// 檢查事件行的格式
	let eventType = '';
	let dataLine = '';

	for (const line of eventLines) {
		if (line.startsWith('event:')) {
			eventType = line.replace('event:', '').trim();
		} else if (line.startsWith('event: ')) {
			eventType = line.replace('event: ', '').trim();
		} else if (line.startsWith('data:')) {
			dataLine = line.replace('data:', '').trim();
		} else if (line.startsWith('data: ')) {
			dataLine = line.replace('data: ', '').trim();
		}
	}

	if (!eventType || !dataLine) {
		console.warn('未能正確解析事件類型或數據行:', chunk);
		return accumulatedText;
	}

	try {
		// 檢查 JSON 格式是否有效
		try {
			JSON.parse(dataLine);
		} catch {
			// 嘗試使用正則表達式提取 JSON 部分
			const jsonRegex = /({.*}|\[.*\])/;
			const jsonMatch = jsonRegex.exec(dataLine);
			if (jsonMatch) {
				dataLine = jsonMatch[0];
			}
		}

		const rawData = JSON.parse(dataLine) as unknown;

		switch (eventType) {
			case ChatEvent.MessageStart: {
				const result = messageStartSchema.safeParse(rawData);
				if (result.success) {
					const data = result.data;
					if (data.conv_id && data.msg_id) {
						onMessageStart?.(data.conv_id, data.msg_id);
					}
				} else {
					// 容錯處理：嘗試手動獲取必要字段
					if (typeof rawData === 'object' && rawData !== null) {
						const data = rawData as Record<string, unknown>;
						const convId = data.conv_id;
						const msgId = data.msg_id;
						if (typeof convId === 'string' && typeof msgId === 'string') {
							onMessageStart?.(convId, msgId);
						}
					}
				}
				break;
			}

			case ChatEvent.Heartbeat:
				// 心跳事件，不做特別處理
				heartbeatSchema.safeParse(rawData);
				break;

			case ChatEvent.Thinking: {
				const result = thinkingSchema.safeParse(rawData);
				if (result.success) {
					const data = result.data;
					if (data.content && data.type === ChatEventType.Text) {
						onThinking?.(data.content);
					}
				} else {
					// 容錯處理
					if (typeof rawData === 'object' && rawData !== null) {
						const data = rawData as Record<string, unknown>;
						const content = data.content;
						if (typeof content === 'string') {
							onThinking?.(content);
						}
					}
				}
				break;
			}

			case ChatEvent.Message: {
				const result = messageSchema.safeParse(rawData);
				if (result.success) {
					const data = result.data;
					if (data.type === ChatEventType.Text && data.content) {
						accumulatedText += data.content;
						onTextPart?.(accumulatedText);
					}
				} else {
					// 容錯處理
					if (typeof rawData === 'object' && rawData !== null) {
						const data = rawData as Record<string, unknown>;
						const content = data.content;
						if (typeof content === 'string') {
							accumulatedText += content;
							onTextPart?.(accumulatedText);
						}
					}
				}
				break;
			}

			case ChatEvent.MessageEnd: {
				const result = messageEndSchema.safeParse(rawData);
				if (result.success) {
					const data = result.data;
					if (data.conv_id && data.msg_id) {
						onFinishStepPart?.();
						onMessageEnd?.(data.conv_id, data.msg_id, data.content);
					}
				} else {
					// 容錯處理
					if (typeof rawData === 'object' && rawData !== null) {
						const data = rawData as Record<string, unknown>;
						const convId = data.conv_id;
						const msgId = data.msg_id;
						const content = data.content;
						if (typeof convId === 'string' && typeof msgId === 'string') {
							onFinishStepPart?.();
							onMessageEnd?.(convId, msgId, typeof content === 'string' ? content : undefined);
						}
					}
				}
				break;
			}

			default:
				console.warn(`未知事件類型: ${eventType}`);
		}
	} catch (error) {
		console.error('解析事件數據失敗:', error, '原始數據行:', dataLine);
		onErrorPart?.(error instanceof Error ? error.message : 'Unknown error', error instanceof Error ? error : undefined);
	}

	return accumulatedText;
}
