export interface ChatAIChatState {
	/**
	 * is the AI message is generating
	 */
	chatLoadingIds: string[];
	chatLoadingIdsAbortController?: AbortController;
	inputMessage: string;
	/**
	 * is the message is in RAG flow
	 */
	messageRAGLoadingIds: string[];
	/**
	 * is the AI message is reasoning
	 */
	reasoningLoadingIds: string[];
}

export const initialAiChatState: ChatAIChatState = {
	chatLoadingIds: [],
	inputMessage: '',
	messageRAGLoadingIds: [],
	reasoningLoadingIds: [],
};
