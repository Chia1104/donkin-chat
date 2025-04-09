'use client';

import { memo, useRef, useEffect } from 'react';

import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';

import { AutoScroll } from '@/components/chat/auto-scroll';
import DefaultPrompt from '@/components/chat/default-prompt';
import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import Logo from '@/components/donkin/logo';
import { DonkinStatus } from '@/enums/donkin.enum';
import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useChatStore } from '@/stores/chat';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

const Messages = ({ children }: { children?: React.ReactNode }) => {
	const messages = useChatStore(state => state.items);
	const status = useChatStore(state => state.status);
	const handleRetry = useChatStore(state => state.handleRetry);
	const handleSubmit = useChatStore(state => state.handleSubmit);

	if (!messages || messages.length === 0) {
		return <DefaultPrompt onAction={handleSubmit} />;
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
						isLoading={status === ChatStatus.Streaming && isLast}
						status={status === ChatStatus.Error && isLast ? 'failed' : 'success'}
						onRetry={message =>
							handleRetry(
								message.id,
								message.toolCalls?.length
									? message => {
											if (message.toolCalls) {
												for (const toolCall of message.toolCalls) {
													/**
													 * TODO: Implement tool calls
													 */
													switch (toolCall.function.name) {
														default:
															break;
													}
												}
											}
										}
									: undefined,
							)
						}
					/>
				);
			})}
			{children}
		</section>
	);
};

const ChatBody = () => {
	const status = useChatStore(state => state.status);
	const messages = useChatStore(state => state.items);
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<CardBody
			aria-label="chat-body"
			className="flex flex-col items-center justify-start w-full max-w-full relative p-0 py-3"
		>
			{messages && messages.length > 0 && (
				<Logo current={DonkinStatus.Folded} className="absolute top-0 left-0 size-8 z-[100]" />
			)}
			<ScrollShadow
				ref={containerRef}
				aria-label="chat-scroll-shadow"
				className="w-full max-w-full h-[calc(100vh-300px)] overflow-y-auto"
			>
				<div
					className={cn(
						'flex min-h-full justify-center',
						messages && messages.length > 0 ? 'items-start' : 'items-center',
					)}
				>
					<Messages />
				</div>
			</ScrollShadow>
			{messages && messages.length > 0 && (
				<AutoScroll
					containerRef={containerRef}
					enabled={status === ChatStatus.Streaming}
					wrapperClassName="absolute bottom-5 left-1/2 -translate-x-1/2 z-10"
				/>
			)}
		</CardBody>
	);
};

const ChatFooter = memo(() => {
	const handleSubmit = useChatStore(state => state.handleSubmit);
	const setInput = useChatStore(state => state.setInput);
	const input = useChatStore(state => state.input);
	const enabled = useChatStore(state => state.enabled);
	return (
		<CardFooter
			aria-label="chat-footer"
			className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0"
		>
			<PromptInput
				props={{ textarea: { isDisabled: !enabled, autoFocus: true } }}
				onChange={e => {
					setInput(e.target.value);
				}}
				value={input}
				onSubmit={e => {
					e.preventDefault();
					handleSubmit();
				}}
			/>
		</CardFooter>
	);
});

const ThreadId = () => {
	const threadId = useChatStore(state => state.threadId);
	const [, setSearchParams] = useAISearchParams();
	useEffect(() => {
		if (threadId && threadId !== 'inbox') {
			void setSearchParams({ threadId });
		}
	}, [setSearchParams, threadId]);
	return null;
};

const Chat = () => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	return (
		<Card
			className={cn(
				'bg-[#FFFFFF08] shadow-none p-5 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-130px)] max-h-[calc(100vh-130px)]',
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
			<ThreadId />
		</Card>
	);
};

export default Chat;
