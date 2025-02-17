import type { ChatAIChatState } from './initialState';

const isMessageInReasoning = (id: string) => (s: ChatAIChatState) => s.reasoningLoadingIds.includes(id);

export const aiChatSelectors = {
	isMessageInReasoning,
};
