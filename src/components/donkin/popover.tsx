'use client';

import type { ReactNode } from 'react';
import { Fragment } from 'react';

import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Listbox, ListboxItem } from '@heroui/listbox';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import Logo from '../donkin/logo';

interface Props {
	header?: ReactNode;
	body?: ReactNode;
	onClose?: () => void;
	askMore?: string[];
	onAskMore?: (item: string) => void;
	className?: string;
}

const DonkinPopover = (props: Props) => {
	const { header, onClose, askMore, onAskMore, className, body } = props;
	const t = useTranslations('token.order-popover');
	return (
		<Card className={cn('w-full max-w-[220px] shadow-none', className)} radius="md">
			{header && (
				<CardHeader className="flex flex-row items-center">
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
							<CloseIcon
								sx={{
									width: '18px',
									height: '18px',
								}}
							/>
						</Button>
					)}
				</CardHeader>
			)}
			<CardBody>
				{body}
				{askMore && askMore.length > 0 && (
					<div className="flex flex-col gap-2">
						<div className="flex gap-1 items-center">
							<Logo current="open" isActivatable={false} className="size-[14px]" />
							<span className="font-normal text-xs text-primary">{t('ask-more')}</span>
						</div>
						<Listbox aria-label="ask-more" className="bg-content1-300 rounded-md px-1.5 py-1" variant="light">
							{askMore.map((item, index) => (
								<Fragment key={item}>
									<ListboxItem
										aria-label={item}
										classNames={{
											title: 'font-normal text-xs text-description',
										}}
										onPress={() => onAskMore?.(item)}
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
};

export default DonkinPopover;
