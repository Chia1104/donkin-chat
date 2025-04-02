'use client';

import { memo } from 'react';

import { useChat } from '@ai-sdk/react';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';

import DefaultPrompt from '@/components/chat/default-prompt';
import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import Logo from '@/components/donkin/logo';
import { DonkinStatus } from '@/enums/donkin.enum';
import { useChatStore } from '@/stores/chat';
import { useChatStore as useChatStoreNew } from '@/stores/chat/store';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

export const useUIChat = () => {
	const chatId = useChatStore(state => state.chatId);
	return useChat({
		id: chatId,
	});
};

const Messages = ({ children }: { children?: React.ReactNode }) => {
	const { items: messages, status } = useChatStoreNew(state => state);

	if (!messages || messages.length === 0) {
		return <DefaultPrompt />;
	}

	return (
		<section className="flex flex-col w-full justify-start h-full max-w-full gap-7">
			{messages.map((message, index) => {
				const isLast = index === messages.length - 1;
				return (
					<MessageCard
						key={message.id}
						message={message}
						showFeedback={message.role === 'assistant' && isLast}
						isLoading={status === 'streaming' && isLast}
						status={status === 'error' && isLast ? 'failed' : 'success'}
					/>
				);
			})}
			{children}
		</section>
	);
};

const ChatBody = () => {
	const { items: messages } = useChatStoreNew(state => state);
	return (
		<CardBody
			aria-label="chat-body"
			className="flex flex-col items-center justify-start w-full max-w-full relative p-0 py-3"
		>
			{messages && messages.length > 0 && (
				<Logo current={DonkinStatus.Folded} className="absolute top-0 left-0 size-8 z-[100]" />
			)}
			<ScrollShadow aria-label="chat-scroll-shadow" className="w-full max-w-full h-[calc(100vh-300px)]">
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
	return (
		<CardFooter
			aria-label="chat-footer"
			className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0"
		>
			<PromptInput props={{ textarea: { isDisabled: true } }} />
		</CardFooter>
	);
});

const Chat = () => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	return (
		<Card
			className={cn(
				'bg-[#FFFFFF08] shadow-none p-5 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
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
