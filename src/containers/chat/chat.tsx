'use client';

import { memo } from 'react';

import { useChat } from '@ai-sdk/react';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';

import DefaultPrompt from '@/components/chat/default-prompt';
import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import Logo from '@/components/commons/donkin/logo';
import { DonkinStatus } from '@/enums/donkin.enum';
import { useChatStore } from '@/stores/chat';
import { useGlobalStore } from '@/stores/global/store';
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
		<section className="flex flex-col w-full justify-start h-full min-w-full">
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
	const { status, messages } = useUIChat();
	return (
		<CardBody aria-label="chat-body" className="flex flex-col items-center justify-start w-full relative">
			{messages && messages.length > 0 && (
				<Logo
					current={status === 'streaming' ? DonkinStatus.Thinking : DonkinStatus.Open}
					className="absolute top-0 left-0 size-8 z-[9999]"
				/>
			)}
			<ScrollShadow aria-label="chat-scroll-shadow" className="w-full min-w-full h-[calc(100vh-300px)]">
				<div
					className={cn(
						'flex min-h-full justify-center',
						messages && messages.length > 0 ? 'items-start' : 'items-center',
					)}
				>
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
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	return (
		<Card
			className={cn(
				'bg-[#FFFFFF08] shadow-none p-4 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
				!isOpen ? 'w-[30px] rounded-full' : 'min-w-full',
			)}
			radius="sm"
		>
			<AnimatePresence mode="popLayout">
				{isOpen && (
					<motion.div
						className="flex flex-col w-full h-full"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						transition={{
							type: 'spring',
							duration: 0.5,
						}}
					>
						<ChatBody />
						<ChatFooter />
					</motion.div>
				)}
			</AnimatePresence>
		</Card>
	);
};

export default Chat;
