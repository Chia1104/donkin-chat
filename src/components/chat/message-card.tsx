'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { cn } from '@heroui/theme';
import { useTranslations } from 'next-intl';

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
};

const MessageCard = ({
	message,
	showFeedback,
	status,
	className,
	onRetry,
	isRetrying,
	isLoading,
	experimental,
	...props
}: MessageCardProps) => {
	const [isPending, startTransition] = React.useTransition();
	const t = useTranslations('chat');

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
			{isLoading && (
				<Spinner
					size="sm"
					classNames={{
						base: 'flex flex-row w-fit',
					}}
					label={t('search.title')}
					variant="gradient"
				/>
			)}
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
		prevProps.showFeedback === nextProps.showFeedback
	);
});
