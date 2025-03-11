'use client';

import { memo } from 'react';

import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';

import DefaultPrompt from '@/components/chat/default-prompt';
import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import { useChatStore } from '@/contexts/chat-provider';
import { useChat } from '@/libs/ai/hooks/useChat';
import { cn } from '@/utils/cn';

const useUIChat = () => {
	const chatId = useChatStore(state => state.chatId);
	return useChat({
		id: chatId,
	});
};

const Messages = ({ children }: { children?: React.ReactNode }) => {
	const { messages, status, reload } = useUIChat();

	if (!messages || messages.length === 0) {
		return <DefaultPrompt />;
	}

	return (
		<section className="flex flex-col gap-5 w-full justify-start h-full min-w-full">
			{messages.map((message, index) => {
				const isLast = index === messages.length - 1;
				return (
					<MessageCard
						key={message.id}
						message={message}
						showFeedback={message.role === 'assistant' && isLast}
						isLoading={status === 'streaming'}
						status={status === 'error' && isLast ? 'failed' : 'success'}
						isCurrent={isLast}
						onRetry={reload}
						streamingContent={status === 'streaming' && isLast ? message.content : undefined}
					/>
				);
			})}
			{children}
		</section>
	);
};

const ChatBody = () => {
	return (
		<CardBody aria-label="chat-body" className="flex flex-col items-center justify-start w-full">
			<ScrollShadow
				aria-label="chat-scroll-shadow"
				className="w-full min-w-full h-[calc(100vh-290px)] max-h-[calc(100vh-290px)] min-h-[calc(100vh-330px)]"
			>
				<div className="flex h-full justify-center items-center">
					<Messages />
				</div>
			</ScrollShadow>
		</CardBody>
	);
};

const ChatFooter = memo(() => {
	const { input, handleInputChange, handleSubmit } = useUIChat();
	return (
		<CardFooter
			aria-label="chat-footer"
			className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0"
		>
			<PromptInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
		</CardFooter>
	);
});

const Chat = () => {
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);

	return (
		<section
			className={cn(
				'h-[calc(100vh-72px)] w-full p-5 md:pl-0 md:py-5 transition-width ease-in-out duration-1000',
				isPreviewOnly ? 'w-[70px]' : 'w-full lg:w-1/3',
			)}
		>
			<Card
				className={cn(
					'bg-transparent shadow-none p-3 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
					isPreviewOnly ? 'w-[30px] rounded-full' : 'min-w-full',
				)}
			>
				<AnimatePresence mode="popLayout">
					{!isPreviewOnly && (
						<motion.div
							className="flex flex-col w-full h-full"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								type: 'spring',
								duration: 1,
							}}
						>
							<ChatBody />
							<ChatFooter />
						</motion.div>
					)}
				</AnimatePresence>
			</Card>
		</section>
	);
};

export default Chat;
