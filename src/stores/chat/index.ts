import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

export interface ChatState {
	chatId: string;
	isPreviewOnly: boolean;
	/**
	 * TODO: define preview schema
	 */
	preview: any;
}

export interface ChatActions {
	updatePreview: (preview: any) => void;
	setIsPreviewOnly: (isPreviewOnly?: boolean) => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
	chatId: '',
	isPreviewOnly: false,
	preview: null,
};

export const createChatStore = (initState?: Partial<ChatState>) => {
	const state = Object.assign({ ...defaultInitState }, initState);
	return createStore<ChatStore>()(set => ({
		...state,
		updatePreview: (preview: any) =>
			set(state =>
				produce(state, draft => {
					draft.preview = preview;
				}),
			),
		setIsPreviewOnly: isPreviewOnly =>
			set(state =>
				produce(state, draft => {
					draft.isPreviewOnly = isPreviewOnly ?? false;
				}),
			),
	}));
};
