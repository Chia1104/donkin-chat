import isEqual from 'fast-deep-equal';
import type { SWRResponse } from 'swr';
import { mutate } from 'swr';
import type { StateCreator } from 'zustand/vanilla';

import type { ChatStore } from '@/stores/chat/store';
import type { ModelReasoning } from '@/types/message/base';
import type { ChatMessage, ChatMessageError, CreateMessageParams } from '@/types/message/chat';
import { setNamespace } from '@/utils/storeDebug';
import { copyToClipboard } from '@/utils/ui';
import { nanoid } from '@/utils/uuid';

import type { ChatStoreState } from '../../initialState';
import { ChatSelectors } from '../../selectors';
import { preventLeavingFn, toggleBooleanList } from '../../utils';
import type { MessageDispatch } from './reducers';
import { messagesReducer } from './reducers';

const nameSpace = setNamespace('chat/message');

export interface ChatMessageAction {
	// create
	addAIMessage: () => Promise<void>;
	// delete
	/**
	 * clear message on the active session
	 */
	clearMessage: () => Promise<void>;
	deleteMessage: (id: string) => Promise<void>;

	clearAllMessages: () => Promise<void>;
	// update
	updateInputMessage: (message: string) => void;
	modifyMessageContent: (id: string, content: string) => Promise<void>;

	// query
	useFetchMessages: (enable: boolean, sessionId: string, topicId?: string) => SWRResponse<ChatMessage[]>;
	copyMessage: (id: string, content: string) => Promise<void>;
	refreshMessages: () => Promise<void>;

	// =========  ↓ Internal Method ↓  ========== //
	// ========================================== //
	// ========================================== //

	/**
	 * update message at the frontend
	 * this method will not update messages to database
	 */
	internal_dispatchMessage: (payload: MessageDispatch) => void;

	/**
	 * update the message content with optimistic update
	 * a method used by other action
	 */
	internal_updateMessageContent: (id: string, content: string, reasoning?: ModelReasoning) => Promise<void>;
	/**
	 * update the message error with optimistic update
	 */
	internal_updateMessageError: (id: string, error: ChatMessageError | null) => Promise<void>;
	/**
	 * create a message with optimistic update
	 */
	internal_createMessage: (
		params: CreateMessageParams,
		context?: { tempMessageId?: string; skipRefresh?: boolean },
	) => Promise<string>;
	/**
	 * create a temp message for optimistic update
	 * otherwise the message will be too slow to show
	 */
	internal_createTmpMessage: (params: CreateMessageParams) => string;
	/**
	 * delete the message content with optimistic update
	 */
	internal_deleteMessage: (id: string) => Promise<void>;

	internal_fetchMessages: () => Promise<void>;

	/**
	 * method to toggle message create loading state
	 * the AI message status is creating -> generating
	 * other message role like user and tool , only this method need to be called
	 */
	internal_toggleMessageLoading: (loading: boolean, id: string) => void;

	/**
	 * helper to toggle the loading state of the array,used by these three toggleXXXLoading
	 */
	internal_toggleLoadingArrays: (
		key: keyof ChatStoreState,
		loading: boolean,
		id?: string,
		action?: string,
	) => AbortController | undefined;
}

export const chatMessage: StateCreator<ChatStore, [['zustand/devtools', never]], [], ChatMessageAction> = (
	set,
	get,
) => ({
	deleteMessage: async id => {
		const message = ChatSelectors.getMessageById(id)(get());
		if (!message) return;

		const ids = [message.id];

		get().internal_dispatchMessage({ type: 'deleteMessages', ids });
		await get().refreshMessages();
	},

	clearMessage: async () => {
		const { refreshMessages } = get();
		await refreshMessages();
	},

	clearAllMessages: async () => {
		const { refreshMessages } = get();
		await refreshMessages();
	},

	addAIMessage: async () => {
		const { internal_createMessage, updateInputMessage, activeId, inputMessage } = get();
		if (!activeId) return;

		await internal_createMessage({
			content: inputMessage,
			role: 'assistant',
			sessionId: activeId,
		});

		updateInputMessage('');
	},

	copyMessage: async (id, content) => {
		await copyToClipboard(content);
	},

	// toggleMessageEditing: (id, editing) => {
	// 	set({ messageEditingIds: toggleBooleanList(get().messageEditingIds, id, editing) }, false, 'toggleMessageEditing');
	// },

	updateInputMessage: message => {
		if (isEqual(message, get().inputMessage)) return;

		set({ inputMessage: message }, false, nameSpace('updateInputMessage', message));
	},

	modifyMessageContent: async (id, content) => {
		await get().internal_updateMessageContent(id, content);
	},

	// useFetchMessages: (enable, sessionId, activeTopicId) =>
	// 	useClientDataSWR<ChatMessage[]>(
	// 		enable ? [SWR_USE_FETCH_MESSAGES, sessionId, activeTopicId] : null,
	// 		async ([, sessionId, topicId]: [string, string, string | undefined]) =>
	// 			messageService.getMessages(sessionId, topicId),
	// 		{
	// 			onSuccess: (messages, key) => {
	// 				const nextMap = {
	// 					...get().messagesMap,
	// 					[messageMapKey(sessionId, activeTopicId)]: messages,
	// 				};
	// 				// no need to update map if the messages have been init and the map is the same
	// 				if (get().messagesInit && isEqual(nextMap, get().messagesMap)) return;

	// 				set(
	// 					{ messagesInit: true, messagesMap: nextMap },
	// 					false,
	// 					nameSpace('useFetchMessages', { messages, queryKey: key }),
	// 				);
	// 			},
	// 		},
	// 	),

	// refreshMessages: async () => {
	// 	await mutate([SWR_USE_FETCH_MESSAGES, get().activeId]);
	// },

	// the internal process method of the AI message
	internal_dispatchMessage: payload => {
		const { activeId } = get();

		if (!activeId) return;

		const messages = messagesReducer(ChatSelectors.activeBaseChats(get()), payload);

		const nextMap = { ...get().messagesMap, [ChatSelectors.currentChatKey(get())]: messages };

		if (isEqual(nextMap, get().messagesMap)) return;

		set({ messagesMap: nextMap }, false, { type: `dispatchMessage/${payload.type}`, payload });
	},

	// internal_updateMessageError: async (id, error) => {
	// 	get().internal_dispatchMessage({ id, type: 'updateMessage', value: { error } });
	// 	await messageService.updateMessage(id, { error });
	// 	await get().refreshMessages();
	// },

	// internal_updateMessageContent: async (id, content, toolCalls, reasoning) => {
	// 	const { internal_dispatchMessage, refreshMessages, internal_transformToolCalls } = get();

	// 	// Due to the async update method and refresh need about 100ms
	// 	// we need to update the message content at the frontend to avoid the update flick
	// 	// refs: https://medium.com/@kyledeguzmanx/what-are-optimistic-updates-483662c3e171
	// 	internal_dispatchMessage({ id, type: 'updateMessage', value: { content } });

	// 	await messageService.updateMessage(id, {
	// 		content,
	// 		tools: toolCalls ? internal_transformToolCalls(toolCalls) : undefined,
	// 		reasoning,
	// 	});
	// 	await refreshMessages();
	// },

	// internal_createMessage: async (message, context) => {
	// 	const { internal_createTmpMessage, refreshMessages, internal_toggleMessageLoading } = get();
	// 	let tempId = context?.tempMessageId;
	// 	if (!tempId) {
	// 		// use optimistic update to avoid the slow waiting
	// 		tempId = internal_createTmpMessage(message);

	// 		internal_toggleMessageLoading(true, tempId);
	// 	}

	// 	const id = await messageService.createMessage(message);
	// 	if (!context?.skipRefresh) {
	// 		internal_toggleMessageLoading(true, tempId);
	// 		await refreshMessages();
	// 	}

	// 	internal_toggleMessageLoading(false, tempId);
	// 	return id;
	// },

	// internal_fetchMessages: async () => {
	// 	const messages = await messageService.getMessages(get().activeId, get().activeTopicId);
	// 	const nextMap = { ...get().messagesMap, [ChatSelectors.currentChatKey(get())]: messages };
	// 	// no need to update map if the messages have been init and the map is the same
	// 	if (get().messagesInit && isEqual(nextMap, get().messagesMap)) return;

	// 	set({ messagesInit: true, messagesMap: nextMap }, false, nameSpace('internal_fetchMessages', { messages }));
	// },

	internal_createTmpMessage: message => {
		const { internal_dispatchMessage } = get();

		// use optimistic update to avoid the slow waiting
		const tempId = 'tmp_' + nanoid();
		internal_dispatchMessage({ type: 'createMessage', id: tempId, value: message });

		return tempId;
	},

	// internal_deleteMessage: async (id: string) => {
	// 	get().internal_dispatchMessage({ type: 'deleteMessage', id });
	// 	await messageService.removeMessage(id);
	// 	await get().refreshMessages();
	// },

	// ----- Loading ------- //
	internal_toggleMessageLoading: (loading, id) => {
		set(
			{
				messageLoadingIds: toggleBooleanList(get().messageLoadingIds, id, loading),
			},
			false,
			'internal_toggleMessageLoading',
		);
	},
	internal_toggleLoadingArrays: (key, loading, id, action) => {
		const abortControllerKey = `${key}AbortController`;
		if (loading) {
			window.addEventListener('beforeunload', preventLeavingFn);

			const abortController = new AbortController();
			set(
				{
					[abortControllerKey]: abortController,
					[key]: toggleBooleanList(get()[key] as string[], id!, loading),
				},
				false,
				action,
			);

			return abortController;
		} else {
			if (!id) {
				set({ [abortControllerKey]: undefined, [key]: [] }, false, action);
			} else
				set(
					{
						[abortControllerKey]: undefined,
						[key]: toggleBooleanList(get()[key] as string[], id, loading),
					},
					false,
					action,
				);

			window.removeEventListener('beforeunload', preventLeavingFn);
		}
	},
});
