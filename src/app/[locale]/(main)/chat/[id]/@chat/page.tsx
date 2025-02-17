'use client';

import { useCallback } from 'react';

import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslations } from 'next-intl';

import MessageCard from '@/components/chat/message-card';
import PromptInput from '@/components/chat/prompt-input';
import { useChatStore } from '@/contexts/chat-provider';
import { useChat } from '@/features/ai/hooks/useChat';
import { cn } from '@/utils/cn';

import DefaultPrompt from './_components/default-prompt';

const StreamingMessage = () => {
	const { currentMessage, asyncStatus } = useChatStore(state => state);

	if (!currentMessage || currentMessage.role !== 'assistant' || !asyncStatus.isLoading) {
		return null;
	}

	return (
		<MessageCard
			key={currentMessage.id}
			message={currentMessage}
			isLoading={asyncStatus.isLoading}
			status={asyncStatus.error ? 'failed' : 'success'}
			isCurrent
		/>
	);
};

const Messages = ({ children }: { children?: React.ReactNode }) => {
	const { messages, asyncStatus } = useChatStore(state => state);

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
						isLoading={asyncStatus.isLoading}
						status={asyncStatus.error && isLast ? 'failed' : 'success'}
						isCurrent={isLast}
					/>
				);
			})}
			{children}
		</section>
	);
};

const ChatBody = () => {
	return (
		<CardBody className="flex flex-col items-center justify-start">
			<ScrollShadow className="w-full min-w-full h-[calc(100vh-300px)] max-h-[calc(100vh-300px)] min-h-[calc(100vh-350px)]">
				<div className="flex justify-center items-center">
					<Messages>
						<StreamingMessage />
					</Messages>
				</div>
			</ScrollShadow>
		</CardBody>
	);
};

const ChatFooter = () => {
	const { chatId, syncMessages, updateCurrentMessage, completed, messages } = useChatStore(state => state);
	const t = useTranslations('chat');
	const { input, handleInputChange, handleSubmit } = useChat({
		id: chatId,
		onChatComplete: messages => {
			syncMessages(messages);
			completed();
		},
		onStreaming: updateCurrentMessage,
		onSubmit: input => {
			syncMessages(messages.concat(input));
		},
	});

	return (
		<CardFooter className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0">
			<PromptInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
			<p className="text-xs">{t('donkin-warning')}</p>
		</CardFooter>
	);
};

const PreviewAction = () => {
	const { setIsPreviewOnly, isPreviewOnly } = useChatStore(state => state);

	const _handleSetIsPreviewOnly = useCallback(() => {
		setIsPreviewOnly(!isPreviewOnly);
	}, [isPreviewOnly, setIsPreviewOnly]);

	return (
		<Button isIconOnly className="rounded-full absolute top-1/2 -left-5 z-30 border-1" variant="faded" color="default">
			<ArrowForwardIosIcon sx={{ width: 16, height: 16 }} />
		</Button>
	);
};

const Page = () => {
	return (
		<>
			<Card
				className={cn(
					'bg-background/65 p-5 relative overflow-visible min-w-full border-1 border-divider min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
				)}
			>
				<PreviewAction />
				<ChatBody />
				<ChatFooter />
			</Card>
		</>
	);
};

export default Page;
