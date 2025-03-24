'use client';

import React from 'react';

import type { UIMessage } from '@ai-sdk/ui-utils';
import { Badge } from '@heroui/badge';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { CircularProgress } from '@heroui/progress';
import { cn } from '@heroui/theme';
import { useClipboard } from '@heroui/use-clipboard';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import rehypeShiki from '@shikijs/rehype';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { HeroButton } from '../ui/hero-button';

const MarkdownHooks = dynamic(() => import('react-markdown').then(mod => mod.MarkdownHooks), { ssr: false });

const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
	showFeedback?: boolean;
	message: UIMessage;
	streamingContent?: string;
	status?: 'success' | 'failed';
	messageClassName?: string;
	onMessageCopy?: (content: string | string[]) => void;
	onRetry?: () => void;
	onShare?: () => void;
	isRetrying?: boolean;
	isLoading?: boolean;
	isCurrent?: boolean;
	experimental?: {
		shiki?: boolean;
	};
};

const MessageCard = ({
	message,
	showFeedback,
	status,
	onMessageCopy,
	className,
	messageClassName,
	onShare,
	onRetry,
	isRetrying,
	isLoading,
	isCurrent,
	streamingContent,
	experimental,
	...props
}: MessageCardProps) => {
	const messageRef = React.useRef<HTMLDivElement>(null);
	const [isPending, startTransition] = React.useTransition();
	const t = useTranslations('meta');

	const { copied, copy } = useClipboard();

	const hasFailed = status === 'failed';

	const handleCopy = React.useCallback(() => {
		copy(message.content);

		onMessageCopy?.(message.content);
	}, [copy, message, onMessageCopy]);

	const handleShare = React.useCallback(() => {
		onShare?.();
	}, [onShare]);

	const handleRetry = React.useCallback(() => {
		startTransition(() => onRetry?.());
	}, [onRetry]);

	const classNames = React.useMemo(() => {
		const wrapperClassName = message.role === 'user' ? 'self-end' : 'self-start';

		const failedMessageClassName =
			status === 'failed'
				? 'bg-danger-100/50 border border-danger-100 text-foreground p-5'
				: message.role === 'user'
					? 'bg-content1'
					: '';

		return {
			wrapperClassName,
			failedMessageClassName,
		};
	}, [message.role, status]);

	return (
		<div {...props} className={cn('flex flex-col gap-1 w-fit', classNames.wrapperClassName, className)}>
			{(message.role === 'assistant' || streamingContent) && (
				<div className="relative flex-none">
					<Badge
						aria-label="assistant-badge"
						isOneChar
						color="danger"
						content={<CircleIcon />}
						isInvisible={!hasFailed}
						placement="bottom-right"
						shape="circle"
					>
						<Chip variant="dot" className="border-none px-0 text-default-500">
							{t('title')}
						</Chip>
					</Badge>
				</div>
			)}
			<div className="flex w-full flex-col gap-4">
				<div
					className={cn(
						'relative w-full rounded-medium px-4 text-default-600 flex flex-col gap-6',
						classNames.failedMessageClassName,
						messageClassName,
					)}
				>
					<div ref={messageRef} className={'text-small flex flex-col max-w-[300px] prose prose-invert'}>
						{((isLoading && message.role === 'assistant' && isCurrent) || (isLoading && streamingContent)) && (
							<CircularProgress size="sm" />
						)}
						{hasFailed ? (
							<p>
								Something went wrong, if the issue persists please contact us through our help center at&nbsp;
								<Link aria-label="support-email" href="mailto:support@acmeai.com" size="sm">
									support@acmeai.com
								</Link>
							</p>
						) : (
							<div className="">
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
							</div>
						)}
						{showFeedback && !hasFailed && !isLoading && (
							<div className="flex">
								<HeroButton
									variant="light"
									aria-label="share-button"
									isIconOnly
									size="sm"
									onPress={() => handleShare()}
								>
									<ShareOutlinedIcon
										className="text-default-600"
										sx={{
											width: 16,
											height: 16,
										}}
									/>
								</HeroButton>
								<HeroButton variant="light" aria-label="copy-button" isIconOnly size="sm" onPress={handleCopy}>
									{copied ? (
										<CheckIcon
											sx={{
												width: 16,
												height: 16,
											}}
											className="text-default-600"
										/>
									) : (
										<ContentCopyRoundedIcon
											sx={{
												width: 16,
												height: 16,
											}}
											className="text-default-600"
										/>
									)}
								</HeroButton>
								<HeroButton
									variant="light"
									aria-label="retry-button"
									isIconOnly
									size="sm"
									onPress={() => handleRetry()}
									isLoading={isPending || isRetrying}
								>
									<RefreshIcon
										sx={{
											width: 20,
											height: 20,
										}}
										className="text-default-600"
									/>
								</HeroButton>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(MessageCard, (prevProps, nextProps) => {
	return (
		prevProps.message.content === nextProps.message.content &&
		prevProps.status === nextProps.status &&
		prevProps.isLoading === nextProps.isLoading &&
		prevProps.isCurrent === nextProps.isCurrent &&
		prevProps.isRetrying === nextProps.isRetrying &&
		prevProps.streamingContent === nextProps.streamingContent
	);
});
