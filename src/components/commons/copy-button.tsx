'use client';

import type { ButtonProps, PressEvent } from '@heroui/button';
import { Button } from '@heroui/button';
import type { ImageProps } from '@heroui/image';
import { Tooltip } from '@heroui/tooltip';
import { useClipboard } from '@heroui/use-clipboard';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import { cn } from '@/utils/cn';

interface Props extends Omit<ButtonProps, 'onPress' | 'onCopy'> {
	content: string;
	timeout?: number;
	onCopy?: (e: PressEvent) => void;
	iconProps?: React.ComponentPropsWithoutRef<'span'> | ImageProps;
}

const CopyButton = ({ content, onCopy, timeout, iconProps, ...props }: Props) => {
	const { copy, copied } = useClipboard({ timeout });
	const tAction = useTranslations('action');
	return (
		<Tooltip content={copied ? tAction('copied') : tAction('copy')} size="sm">
			<Button
				aria-label="copy"
				isIconOnly
				radius="full"
				size="sm"
				{...props}
				className={cn('bg-background max-w-5 h-5 max-h-5 w-5 min-w-5 min-h-5 p-0 text-default-600', props.className)}
				onPress={e => {
					copy(content);
					onCopy?.(e);
				}}
			>
				{copied ? (
					<span {...iconProps} className={cn('i-material-symbols-done-all size-3', iconProps?.className)} />
				) : (
					<NextImage
						src="/assets/images/copy.svg"
						alt="copy"
						width={20}
						height={20}
						className={cn(iconProps?.className)}
					/>
				)}
			</Button>
		</Tooltip>
	);
};

export default CopyButton;
