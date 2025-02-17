'use client';

import { useCallback } from 'react';

import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import MessageCard from '@/components/chat/message-card';
import PromptInput, { Props as PromptInputProps } from '@/components/chat/prompt-input';
import Drawer from '@/components/ui/drawer';
import { useChatStore } from '@/contexts/chat-provider';
import { useChat } from '@/features/ai/hooks/useChat';
import { cn } from '@/utils/cn';

import DefaultPrompt from './_components/default-prompt';

const useUIChat = () => {
	const { chatId, syncMessages, updateCurrentMessage, completed, messages } = useChatStore(state => state);
	return useChat({
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
};

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

const ChatFooter = (props: PromptInputProps) => {
	const t = useTranslations('chat');

	return (
		<CardFooter className="rounded-none flex flex-col items-center prose prose-invert mt-auto min-w-full p-0 sticky bottom-0">
			<PromptInput {...props} />
			<p className="text-xs">{t('donkin-warning')}</p>
		</CardFooter>
	);
};

const PreviewAction = () => {
	const { setIsPreviewOnly, isPreviewOnly } = useChatStore(state => state);

	const handleSetIsPreviewOnly = useCallback(() => {
		setIsPreviewOnly(!isPreviewOnly);
	}, [isPreviewOnly, setIsPreviewOnly]);

	return (
		<Button
			isIconOnly
			className="rounded-full absolute top-1/2 -left-5 z-30 border-1"
			variant="faded"
			color="default"
			onPress={handleSetIsPreviewOnly}
		>
			{!isPreviewOnly ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
		</Button>
	);
};

const Page = () => {
	const { setIsPreviewOnly, isPreviewOnly } = useChatStore(state => state);
	const { input, handleInputChange, handleSubmit } = useUIChat();
	return (
		<section
			className={cn('h-[calc(100vh-72px)] w-full p-5 md:pl-0 md:py-5', isPreviewOnly ? 'w-[70px]' : 'w-full lg:w-1/3')}
		>
			<Drawer
				sidebarPlacement="right"
				className={cn('overflow-visible', isPreviewOnly ? 'w-[50px]' : 'w-full')}
				hideCloseButton={true}
				onOpenChange={setIsPreviewOnly}
			>
				<Card
					className={cn(
						'bg-background/65 p-5 relative overflow-visible border-1 border-divider min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]',
						isPreviewOnly ? 'w-[50px]' : 'min-w-full',
					)}
				>
					<PreviewAction />
					{!isPreviewOnly && (
						<>
							<ChatBody />
							<ChatFooter value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
						</>
					)}
				</Card>
			</Drawer>
		</section>
	);
};

export default Page;
