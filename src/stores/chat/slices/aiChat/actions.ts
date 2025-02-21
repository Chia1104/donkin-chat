/**
 * TODO: implement AI chat system
 */
import { setNamespace } from '@/utils/storeDebug';

const _namespace = setNamespace('chat/aiChat');

export interface ChatAIChatAction {
	/**
	 * Sends a new message to the AI chat system
	 */
	sendMessage: (params: any) => Promise<void>;
	/**
	 * Regenerates a specific message in the chat
	 */
	regenerateMessage: (id: string) => Promise<void>;
	/**
	 * Deletes an existing message and generates a new one in its place
	 */
	delAndRegenerateMessage: (id: string) => Promise<void>;
	/**
	 * Interrupts the ongoing ai message generation process
	 */
	stopGenerateMessage: () => void;
}
