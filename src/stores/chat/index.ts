import { immer } from 'zustand/middleware/immer';
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
	isPreviewOnly: true,
	preview: null,
};

export const createChatStore = (initState?: Partial<ChatState>) => {
	const state = Object.assign({ ...defaultInitState }, initState);
	return createStore<ChatStore>()(
		immer(set => ({
			...state,
			updatePreview: (preview: any) => set(state => (state.preview = preview)),
			setIsPreviewOnly: isPreviewOnly => (state.isPreviewOnly = isPreviewOnly ?? false),
		})),
	);
};
