'use client';

import type { ButtonProps, PressEvent } from '@heroui/button';
import { Button } from '@heroui/button';
import { useClipboard } from '@heroui/use-clipboard';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { SvgIconProps } from '@mui/material/SvgIcon';

import { cn } from '@/utils/cn';

interface Props extends Omit<ButtonProps, 'onPress' | 'onCopy'> {
	content: string;
	timeout?: number;
	onCopy?: (e: PressEvent) => void;
	iconProps?: Partial<SvgIconProps>;
}

const CopyButton = ({ content, onCopy, timeout, iconProps, ...props }: Props) => {
	const { copy, copied } = useClipboard({ timeout });

	return (
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
				<DoneAllIcon sx={{ width: 12, height: 12 }} {...iconProps} />
			) : (
				<ContentCopyRoundedIcon sx={{ width: 12, height: 12 }} {...iconProps} />
			)}
		</Button>
	);
};

export default CopyButton;
