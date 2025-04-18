'use client';

import React, { useRef } from 'react';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Spinner } from '@heroui/spinner';
import { cn } from '@heroui/theme';
import { Tooltip } from '@heroui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { AutoScroll } from '@/components/chat/auto-scroll';
import type { MessageItem } from '@/libs/ai/types/message';

import CopyButton from '../commons/copy-button';
import Markdown from './markdown';

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
	showFeedback?: boolean;
	message: MessageItem;
	status?: 'success' | 'failed';
	onRetry?: (message: MessageItem) => void;
	isRetrying?: boolean;
	isLoading?: boolean;
	experimental?: {
		shiki?: boolean;
	};
	reasoning?: string;
};

const Reasoning = React.memo(
	({
		isLoading,
		reasoning,
		experimental,
	}: {
		isLoading?: boolean;
		reasoning?: string;
		experimental?: { shiki?: boolean };
	}) => {
		const t = useTranslations('chat');
		const containerRef = useRef<HTMLDivElement>(null);

		return (
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.span
						key="loading"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						// className="sticky top-10 backdrop-blur-lg z-20"
					>
						<Accordion
							defaultExpandedKeys={reasoning ? ['reasoning'] : []}
							className="px-0"
							fullWidth={false}
							selectedKeys={!reasoning ? [] : undefined}
						>
							<AccordionItem
								classNames={{
									base: 'not-prose relative',
									trigger: 'py-0',
									content: 'text-foreground-500 text-xs pl-7 max-h-[150px]',
								}}
								key="reasoning"
								title={
									<Spinner
										size="sm"
										classNames={{
											base: 'flex flex-row w-fit',
										}}
										label={t('search.title')}
										variant="gradient"
									/>
								}
								hideIndicator
							>
								<ScrollShadow ref={containerRef} className="max-h-[140px] w-full">
									<Markdown experimental={experimental} content={reasoning ?? ''} />
								</ScrollShadow>
								<AutoScroll
									containerRef={containerRef}
									enabled={isLoading}
									wrapperClassName="hidden absolute bottom-5 left-1/2 -translate-x-1/2"
								/>
							</AccordionItem>
						</Accordion>
					</motion.span>
				) : null}
			</AnimatePresence>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isLoading === nextProps.isLoading &&
			prevProps.reasoning === nextProps.reasoning &&
			prevProps.experimental === nextProps.experimental
		);
	},
);

const MessageCard = ({
	message,
	showFeedback,
	status,
	className,
	onRetry,
	isRetrying,
	isLoading,
	reasoning,
	experimental,
	...props
}: MessageCardProps) => {
	const [isPending, startTransition] = React.useTransition();
	const t = useTranslations('chat');
	const tAction = useTranslations('action');

	const hasFailed = status === 'failed';

	const handleRetry = React.useCallback(() => {
		startTransition(() => onRetry?.(message));
	}, [onRetry, message]);

	const classNames = React.useMemo(() => {
		const failedMessageClassName =
			status === 'failed'
				? 'text-foreground'
				: message.role === 'user'
					? 'bg-[#FFFFFF08] max-w-[66%] self-end p-3 py-2'
					: 'max-w-full w-full';

		return {
			failedMessageClassName,
		};
	}, [message.role, status]);

	return (
		<div
			{...props}
			className={cn(
				'relative w-fit rounded-medium text-default-600 flex flex-col text-small prose prose-invert prose-sm prose-headings:mt-3 prose-headings:mb-2 prose-ul:my-2.5 prose-table:my-2.5',
				classNames.failedMessageClassName,
				className,
			)}
		>
			<Reasoning isLoading={isLoading} reasoning={reasoning} experimental={experimental} />
			{hasFailed ? (
				<p>{t('search.error')}</p>
			) : (
				<>
					<Markdown experimental={experimental} content={message.content ?? ''} />
					{showFeedback && !hasFailed && !isLoading && (
						<div className="flex mb-3">
							<CopyButton
								content={message.content ?? ''}
								variant="light"
								className="bg-transparent max-w-[26px] h-[26px] max-h-[26px] w-[26px] min-w-[26px] min-h-[26px]"
								iconProps={{
									className: 'size-4',
								}}
							/>
							<Tooltip content={tAction('retry')} size="sm">
								<Button
									variant="light"
									aria-label="retry-button"
									isIconOnly
									radius="full"
									size="sm"
									onPress={() => handleRetry()}
									isLoading={isPending || isRetrying}
									className="max-w-[26px] h-[26px] max-h-[26px] w-[26px] min-w-[26px] min-h-[26px]"
								>
									<span className="text-default-600 i-material-symbols-refresh size-4" />
								</Button>
							</Tooltip>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default React.memo(MessageCard, (prevProps, nextProps) => {
	return (
		prevProps.message.content === nextProps.message.content &&
		prevProps.status === nextProps.status &&
		prevProps.isLoading === nextProps.isLoading &&
		prevProps.isRetrying === nextProps.isRetrying &&
		prevProps.showFeedback === nextProps.showFeedback &&
		prevProps.reasoning === nextProps.reasoning
	);
});
