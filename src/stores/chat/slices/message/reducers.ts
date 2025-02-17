import { produce } from 'immer';

import type { ChatMessage, CreateMessageParams } from '@/types/message/chat';
import { merge } from '@/utils/merge';

interface UpdateMessages {
	id: string;
	type: 'updateMessage';
	value: Partial<ChatMessage>;
}

interface CreateMessage {
	id: string;
	type: 'createMessage';
	value: CreateMessageParams;
}

interface DeleteMessage {
	id: string;
	type: 'deleteMessage';
}

interface DeleteMessages {
	ids: string[];
	type: 'deleteMessages';
}

export type MessageDispatch = CreateMessage | UpdateMessages | DeleteMessage | DeleteMessages;

export const messagesReducer = (state: ChatMessage[], payload: MessageDispatch): ChatMessage[] => {
	switch (payload.type) {
		case 'updateMessage': {
			return produce(state, draftState => {
				const { id, value } = payload;
				const index = draftState.findIndex(i => i.id === id);
				if (index < 0) return;

				draftState[index] = merge(draftState[index], { ...value, updatedAt: Date.now() });
			});
		}

		case 'createMessage': {
			return produce(state, draftState => {
				const { value, id } = payload;

				draftState.push({ ...value, createdAt: Date.now(), id, updatedAt: Date.now() });
			});
		}
		case 'deleteMessage': {
			return produce(state, draft => {
				const { id } = payload;

				const index = draft.findIndex(m => m.id === id);

				if (index >= 0) draft.splice(index, 1);
			});
		}
		case 'deleteMessages': {
			return produce(state, draft => {
				const { ids } = payload;

				return draft.filter(item => {
					return !ids.includes(item.id);
				});
			});
		}
		default: {
			throw new Error(`Invalid action type: ${(payload as any).type}`);
		}
	}
};
