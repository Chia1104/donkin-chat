/**
 * TODO: implement local first storage - (indexedDB, PGlite or SQLite ?) & API implementation
 *
 * @description the action only handle api synchronization or local first storage
 */
import type { UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'fast-deep-equal';
import { produce } from 'immer';
import type { StateCreator } from 'zustand/vanilla';

import type { ChatStore } from '@/stores/chat/store';
import type { ChatMessage, CreateMessageParams } from '@/types/message/chat';
import { getQueryClient } from '@/utils/query-client';
import { request } from '@/utils/request';
import { setNamespace } from '@/utils/storeDebug';
import { copyToClipboard } from '@/utils/ui';
import { nanoid } from '@/utils/uuid';

import { ChatSelectors } from '../../selectors';
import type { MessageDispatch } from './reducers';
import { messagesReducer } from './reducers';

const namespace = setNamespace('chat/message');

const toggleBooleanList = (ids: string[], id: string, loading: boolean) => {
	return produce(ids, draft => {
		if (loading) {
			if (!draft.includes(id)) draft.push(id);
		} else {
			const index = draft.indexOf(id);

			if (index >= 0) draft.splice(index, 1);
		}
	});
};

export interface ChatMessageAction {
	// create
	addAIMessage: () => Promise<void>;

	// query
	useQueryMessages: (
		options?: UseQueryOptions<ChatMessage[], Error, ChatMessage[]>,
	) => UseQueryResult<ChatMessage[], Error>;
	refreshMessages: () => Promise<void>;

	// update
	updateInputMessage: (message: string) => void;

	// utils
	copyMessage: (content: string) => Promise<void>;

	// =========  ↓ Internal Method ↓  ========== //
	// ========================================== //
	// ========================================== //

	/**
	 * update message at the frontend
	 * this method will not update messages to database
	 */
	internal_dispatchMessage: (payload: MessageDispatch) => void;

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

	internal_fetchMessages: () => Promise<void>;

	/**
	 * method to toggle message create loading state
	 * the AI message status is creating -> generating
	 * other message role like user and tool , only this method need to be called
	 */
	internal_toggleMessageLoading: (loading: boolean, id: string) => void;
}

export const chatMessage: StateCreator<ChatStore, [['zustand/devtools', never]], [], ChatMessageAction> = (
	set,
	get,
) => ({
	addAIMessage: async () => {
		const { internal_createMessage, updateInputMessage, activeId, inputMessage } = get();
		if (!activeId) return;

		await internal_createMessage({
			content: inputMessage,
			role: 'assistant',
			threadId: activeId,
		});

		updateInputMessage('');
	},
	useQueryMessages: options => {
		const { activeId } = get();
		return useQuery<ChatMessage[], Error, ChatMessage[]>({
			queryKey: ['messages', activeId],
			queryFn: async () => {
				await get().internal_fetchMessages();

				return ChatSelectors.activeBaseChats(get());
			},
			...options,
		});
	},
	refreshMessages: async () => {
		const queryClient = getQueryClient();
		const { activeId } = get();

		if (!activeId) return;

		await queryClient.invalidateQueries({
			queryKey: ['messages', activeId],
		});
	},

	updateInputMessage: message => {
		if (isEqual(message, get().inputMessage)) return;

		set({ inputMessage: message }, false, namespace('updateInputMessage', message));
	},

	copyMessage: async content => {
		await copyToClipboard(content);
	},

	// the internal process method of the AI message
	internal_dispatchMessage: payload => {
		const { activeId } = get();

		if (!activeId) return;

		const messages = messagesReducer(ChatSelectors.activeBaseChats(get()), payload);

		const nextMap = { ...get().messagesMap, [activeId]: messages };

		if (isEqual(nextMap, get().messagesMap)) return;

		set({ messagesMap: nextMap }, false, { type: `dispatchMessage/${payload.type}`, payload });
	},
	internal_fetchMessages: async () => {
		const { activeId } = get();

		if (!activeId) return;

		/**
		 * TODO: api implementation
		 */
		const messages = await request().get<ChatMessage[]>(`/api/messages/${activeId}`).json();

		const nextMap = { ...get().messagesMap, [activeId]: messages };
		// no need to update map if the messages have been init and the map is the same
		if (get().messagesInit && isEqual(nextMap, get().messagesMap)) return;

		set({ messagesInit: true, messagesMap: nextMap }, false, namespace('internal_fetchMessages', { messages }));
	},
	internal_createTmpMessage: message => {
		const { internal_dispatchMessage } = get();

		// use optimistic update to avoid the slow waiting
		const tempId = 'tmp_' + nanoid();
		internal_dispatchMessage({ type: 'createMessage', id: tempId, value: message });

		return tempId;
	},
	internal_createMessage: async (message, context) => {
		const { internal_createTmpMessage, refreshMessages, internal_toggleMessageLoading } = get();
		let tempId = context?.tempMessageId;
		if (!tempId) {
			// use optimistic update to avoid the slow waiting
			tempId = internal_createTmpMessage(message);

			internal_toggleMessageLoading(true, tempId);
		}

		/**
		 * TODO: api implementation
		 */
		const id = await request()
			.post<ChatMessage>('/api/messages', {
				json: message,
			})
			.json()
			.then(res => res.id);

		if (!context?.skipRefresh) {
			internal_toggleMessageLoading(true, tempId);
			await refreshMessages();
		}

		internal_toggleMessageLoading(false, tempId);
		return id;
	},

	internal_toggleMessageLoading: (loading, id) => {
		set(
			{
				messageLoadingIds: toggleBooleanList(get().messageLoadingIds, id, loading),
			},
			false,
			'internal_toggleMessageLoading',
		);
	},
});
