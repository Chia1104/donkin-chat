export interface ChatAIChatState {
	/**
	 * is the AI message is generating
	 */
	chatLoadingIds: string[];
	chatLoadingIdsAbortController?: AbortController;
	inputMessage: string;
	/**
	 * is the AI message is reasoning
	 */
	reasoningLoadingIds: string[];
}

export const initialAiChatState: ChatAIChatState = {
	chatLoadingIds: [],
	inputMessage: '',
	reasoningLoadingIds: [],
};
