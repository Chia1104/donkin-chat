'use client';

import { useCallback, memo } from 'react';

import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
		<section className="flex flex-col gap-5 w-full prose prose-invert justify-start h-full min-w-full">
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
				className="w-full min-w-full h-[calc(100vh-300px)] max-h-[calc(100vh-300px)] min-h-[calc(100vh-350px)]"
			>
				<div className="flex h-full justify-center items-center">
					<Messages />
				</div>
			</ScrollShadow>
		</CardBody>
	);
};

const ChatFooter = memo(() => {
	const t = useTranslations('chat');
	const { input, handleInputChange, handleSubmit } = useUIChat();
	return (
		<CardFooter
			aria-label="chat-footer"
			className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0"
		>
			<PromptInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
			<p className="text-xs">{t('donkin-warning')}</p>
		</CardFooter>
	);
});

const PreviewAction = () => {
	const { setIsPreviewOnly, isPreviewOnly } = useChatStore(state => state);

	const handleSetIsPreviewOnly = useCallback(() => {
		setIsPreviewOnly(!isPreviewOnly);
	}, [isPreviewOnly, setIsPreviewOnly]);

	return (
		<Button
			aria-label="preview-action"
			isIconOnly
			className={cn(
				'rounded-full absolute top-1/2 -left-5 z-30 border-1 overflow-visible bg-background',
				isPreviewOnly && 'border-primary border-2',
			)}
			variant="faded"
			color={isPreviewOnly ? 'primary' : 'default'}
			onPress={handleSetIsPreviewOnly}
		>
			{/* {isPreviewOnly && <span className="rounded-full absolute inset-[0.15rem] bg-primary size-8 animate-ping" />} */}
			{!isPreviewOnly ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
		</Button>
	);
};

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
					'bg-background/65 p-5 relative overflow-visible border-1 border-divider transition-width ease-in-out duration-1000 h-full min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
					isPreviewOnly ? 'w-[30px] rounded-full' : 'min-w-full',
				)}
			>
				<PreviewAction />
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
