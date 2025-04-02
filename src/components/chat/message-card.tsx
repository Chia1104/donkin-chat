'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { cn } from '@heroui/theme';
import RefreshIcon from '@mui/icons-material/Refresh';
import rehypeShiki from '@shikijs/rehype';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import type { MessageItem } from '@/libs/ai/types/message';

import CopyButton from '../commons/copy-button';

const MarkdownHooks = dynamic(() => import('react-markdown').then(mod => mod.MarkdownHooks), { ssr: false });

const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
	showFeedback?: boolean;
	message: MessageItem;
	status?: 'success' | 'failed';
	onRetry?: () => void;
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
		startTransition(() => onRetry?.());
	}, [onRetry]);

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
				'relative w-fit rounded-medium text-default-600 flex flex-col text-small prose prose-invert',
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
					{experimental?.shiki ? (
						<MarkdownHooks
							remarkPlugins={[[remarkGfm], [remarkMath]]}
							rehypePlugins={[
								[
									rehypeShiki,
									{
										theme: 'one-dark-pro',
									},
								],
								[rehypeRaw],
								[rehypeKatex],
							]}
						>
							{message.content}
						</MarkdownHooks>
					) : (
						<Markdown
							remarkPlugins={[[remarkGfm], [remarkMath]]}
							rehypePlugins={[[rehypeSanitize], [rehypeRaw], [rehypeKatex]]}
						>
							{message.content}
						</Markdown>
					)}
					{showFeedback && !hasFailed && !isLoading && (
						<div className="flex">
							<CopyButton
								content={message.content ?? ''}
								variant="light"
								className="bg-transparent max-w-[26px] h-[26px] max-h-[26px] w-[26px] min-w-[26px] min-h-[26px]"
								iconProps={{
									sx: {
										width: 16,
										height: 16,
									},
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
								<RefreshIcon
									sx={{
										width: 16,
										height: 16,
									}}
									className="text-default-600"
								/>
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
		prevProps.isRetrying === nextProps.isRetrying
	);
});
