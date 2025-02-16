'use client';

import React from 'react';

import type { UIMessage } from '@ai-sdk/ui-utils';
import { Chip } from '@heroui/chip';
import { CircularProgress } from '@heroui/progress';
import { Badge, Button, Link } from '@heroui/react';
import { cn } from '@heroui/react';
import { useClipboard } from '@heroui/use-clipboard';
import { Icon } from '@iconify/react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { useTranslations } from 'next-intl';

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
	showFeedback?: boolean;
	message: UIMessage;
	status?: 'success' | 'failed';
	messageClassName?: string;
	onMessageCopy?: (content: string | string[]) => void;
	onRetry?: () => void;
	onShare?: () => void;
	isRetrying?: boolean;
	isLoading?: boolean;
	isCurrent?: boolean;
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
				? 'bg-danger-100/50 border border-danger-100 text-foreground'
				: message.role === 'user'
					? 'bg-content2'
					: '';

		return {
			wrapperClassName,
			failedMessageClassName,
		};
	}, [message.role, status]);

	return (
		<div {...props} className={cn('flex flex-col gap-1 w-fit', classNames.wrapperClassName, className)}>
			{message.role === 'assistant' && (
				<div className="relative flex-none">
					<Badge
						isOneChar
						color="danger"
						content={<Icon className="text-background" icon="gravity-ui:circle-exclamation-fill" />}
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
						'relative w-full rounded-medium px-4 py-3 text-default-600 flex flex-col gap-6',
						classNames.failedMessageClassName,
						messageClassName,
					)}
				>
					<div ref={messageRef} className={'text-small flex flex-col gap-2'}>
						{isLoading && message.role === 'assistant' && isCurrent && <CircularProgress size="sm" />}
						{hasFailed ? (
							<p>
								Something went wrong, if the issue persists please contact us through our help center at&nbsp;
								<Link href="mailto:support@acmeai.com" size="sm">
									support@acmeai.com
								</Link>
							</p>
						) : (
							message.content
						)}
					</div>
					{showFeedback && !hasFailed && !isLoading && (
						<div className="flex gap-2">
							<Button isIconOnly size="sm" onPress={() => handleShare()}>
								<ShareOutlinedIcon
									className="text-default-600"
									sx={{
										width: 20,
										height: 20,
									}}
								/>
							</Button>
							<Button isIconOnly size="sm" onPress={handleCopy}>
								{copied ? (
									<Icon className="size-5 text-default-600" icon="gravity-ui:check" />
								) : (
									<ContentCopyRoundedIcon
										sx={{
											width: 20,
											height: 20,
										}}
										className="text-default-600"
									/>
								)}
							</Button>
							<Button isIconOnly size="sm" onPress={() => handleRetry()} isLoading={isPending || isRetrying}>
								<RefreshIcon
									sx={{
										width: 20,
										height: 20,
									}}
									className="text-default-600"
								/>
							</Button>
						</div>
					)}
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
		prevProps.isRetrying === nextProps.isRetrying
	);
});
