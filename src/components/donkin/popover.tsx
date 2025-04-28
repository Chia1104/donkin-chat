'use client';

import type { ReactNode } from 'react';
import { Fragment, forwardRef, useImperativeHandle, useRef } from 'react';

import { Button } from '@heroui/button';
import type { CardProps } from '@heroui/card';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

import Logo from '../donkin/logo';

interface Props extends CardProps {
	header?: ReactNode;
	body?: ReactNode;
	onClose?: () => void;
	askMore?: string[];
	onAskMore?: (item: string) => void;
	disabled?: boolean;
}

const DonkinPopover = forwardRef<HTMLDivElement | null, Props>((props, ref) => {
	const isPending = useChatStore(state => state.isPending, 'DonkinPopover');
	const { header, onClose, askMore, onAskMore, className, body, disabled = isPending, ...rest } = props;
	const { toggleDonkin } = useGlobalStore(state => state);
	const t = useTranslations('token.order-popover');
	const containerRef = useRef<HTMLDivElement | null>(null);
	const status = useChatStore(state => state.status, 'DonkinPopover');
	useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => containerRef.current);
	return (
		<Card
			radius="md"
			{...rest}
			ref={containerRef}
			className={cn('w-full max-w-[220px] shadow-none bg-[#1C2633]', className)}
		>
			{header && (
				<CardHeader className="flex flex-row items-center justify-between">
					{header}
					{onClose && (
						<Button
							className="text-description w-6 min-w-6 h-6 min-h-6 justify-self-end"
							variant="light"
							size="sm"
							isIconOnly
							radius="full"
							onPress={onClose}
						>
							<span className="text-default-600 i-material-symbols-close size-[18px]" />
						</Button>
					)}
				</CardHeader>
			)}
			<CardBody>
				{!header && onClose && (
					<Button
						className="text-description w-6 min-w-6 h-6 min-h-6 justify-self-end self-end"
						variant="light"
						size="sm"
						isIconOnly
						radius="full"
						onPress={onClose}
					>
						<span className="text-default-600 i-material-symbols-close size-[18px]" />
					</Button>
				)}
				{body}
				{askMore && askMore.length > 0 && (
					<div className="flex flex-col gap-2">
						<div className="flex gap-1 items-center">
							<Logo
								current={status === 'streaming' ? 'thinking' : 'open'}
								isActivatable={false}
								className="size-[16px]"
								enableEffect
							/>
							<span className="font-normal text-xs text-primary">{t('ask-more')}</span>
						</div>
						<Listbox
							disabledKeys={disabled ? askMore : []}
							aria-label="ask-more"
							className="bg-content1-300 rounded-md px-1.5 py-1"
							variant="light"
						>
							{askMore.map((item, index) => (
								<Fragment key={item}>
									<ListboxItem
										key={item}
										aria-label={item}
										classNames={{
											title: 'font-normal text-xs text-description',
										}}
										onPress={() => {
											onAskMore?.(item);
											toggleDonkin(true);
										}}
									>
										{item}
									</ListboxItem>
									{index !== askMore.length - 1 && (
										<ListboxItem aria-label="divider" className="py-0">
											<Divider />
										</ListboxItem>
									)}
								</Fragment>
							))}
						</Listbox>
					</div>
				)}
			</CardBody>
		</Card>
	);
});

export default DonkinPopover;
