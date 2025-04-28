'use client';

import { memo, useRef, unstable_ViewTransition as ViewTransition } from 'react';

import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuthGuard } from '@/components/auth/auth-guard';
import { AutoScroll } from '@/components/chat/auto-scroll';
import DefaultPrompt from '@/components/chat/default-prompt';
import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import Logo from '@/components/donkin/logo';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { DonkinStatus } from '@/enums/donkin.enum';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ChatStatus } from '@/libs/ai/enums/chatStatus.enum';
import { useChatStore } from '@/stores/chat';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

const Messages = ({ children }: { children?: React.ReactNode }) => {
	const messages = useChatStore(state => state.items, 'Chat/Messages');
	const status = useChatStore(state => state.status, 'Chat/Messages');
	const isPending = useChatStore(state => state.isPending, 'Chat/Messages');
	const handleRetry = useChatStore(state => state.handleRetry, 'Chat/Messages');
	const handleSubmit = useChatStore(state => state.handleSubmit, 'Chat/Messages');

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
						isLoading={isPending && isLast}
						status={status === ChatStatus.Error && isLast ? 'failed' : 'success'}
						onRetry={message => handleRetry(message.id)}
						reasoning={message.role === 'assistant' && isLast ? message.reasoning?.content : undefined}
						className={cn(isLast && 'min-h-[calc(100vh-450px)] md:min-h-[calc(100vh-380px)]')}
						/**
						 * TODO: WIP
						 */
						// hoverFeedback={!isLast}
					/>
				);
			})}
			{children}
		</section>
	);
};

const DonkinLogo = () => {
	const messages = useChatStore(state => state.items, 'Chat/DonkinLogo');

	return (
		<>
			{messages && messages.length > 0 && (
				<Logo
					current={DonkinStatus.Folded}
					className="absolute top-5 left-5 size-8 z-40 hidden md:block"
					classNames={{
						active: 'size-9 -top-1 -left-1',
					}}
				/>
			)}
		</>
	);
};

const ChatBody = () => {
	const isPending = useChatStore(state => state.isPending, 'Chat/ChatBody');
	const messages = useChatStore(state => state.items, 'Chat/ChatBody');
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<CardBody
			aria-label="chat-body"
			className="flex flex-col items-center justify-start w-full max-w-full relative p-0 py-3"
		>
			<ScrollShadow
				ref={containerRef}
				aria-label="chat-scroll-shadow"
				className="w-full max-w-full h-[calc(100vh-370px)] md:h-[calc(100vh-300px)] overflow-y-auto"
			>
				<div
					className={cn(
						'flex min-h-full justify-center',
						messages && messages.length > 0 ? 'items-start' : 'items-center',
					)}
				>
					<ViewTransition>
						<Messages />
					</ViewTransition>
				</div>
			</ScrollShadow>
			{messages && messages.length > 0 && (
				<AutoScroll
					containerRef={containerRef}
					enabled={isPending}
					wrapperClassName="absolute bottom-5 left-1/2 -translate-x-1/2 z-10"
				/>
			)}
		</CardBody>
	);
};

const ChatFooter = memo(() => {
	const handleSubmit = useChatStore(state => state.handleSubmit, 'Chat/ChatFooter');
	const setInput = useChatStore(state => state.setInput, 'Chat/ChatFooter');
	const input = useChatStore(state => state.input, 'Chat/ChatFooter');
	const enabled = useChatStore(state => state.enabled, 'Chat/ChatFooter');
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

const Chat = () => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const toggle = useGlobalStore(state => state.toggleDonkin);
	const { isMdWidth } = useMediaQuery();
	const { canActivate } = useAuthGuard('Chat');

	if (isMdWidth) {
		return (
			<Card
				className={cn(
					'bg-[#FFFFFF08] shadow-none p-5 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-130px)] max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-130px)]',
					!isOpen ? 'w-[30px] rounded-full' : 'min-w-full',
				)}
				radius="sm"
			>
				<DonkinLogo />
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
	}

	return (
		<Drawer open={isOpen && canActivate} onOpenChange={toggle}>
			<DrawerContent>
				<DrawerTitle />
				<DrawerDescription />
				<Card
					className={cn(
						'bg-transparent shadow-none p-5 relative overflow-visible transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] w-full min-full',
					)}
					radius="sm"
				>
					<DonkinLogo />
					<div className="flex flex-col w-full h-full">
						<ChatBody />
						<ChatFooter />
					</div>
				</Card>
			</DrawerContent>
		</Drawer>
	);
};

export default Chat;
