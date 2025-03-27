'use client';

import { Fragment } from 'react';

import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { Listbox, ListboxItem } from '@heroui/listbox';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';

import { formatLargeNumber } from '@/utils/format';

import Logo from '../commons/donkin/logo';

interface Props {
	meta: {
		buy: number;
		sell: number;
		order: number;
	};
	total: {
		buy: number;
		sell: number;
		volume: number;
	};
	order: {
		total: number;
		success: number;
	};
	onClose?: () => void;
	askMore?: string[];
	onAskMore?: (item: string) => void;
}

const OrderPopover = (props: Props) => {
	const { meta, total, order, onClose, askMore, onAskMore } = props;
	const t = useTranslations('token.order-popover');
	return (
		<Card className="w-full max-w-[220px]" radius="md">
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex flex-row gap-2 items-center">
					<Chip
						aria-label="buy"
						radius="sm"
						size="sm"
						classNames={{
							base: 'h-5',
							content: 'text-description',
						}}
						startContent={<Image src="/assets/images/buy-icon.svg" alt="buy" />}
					>
						{meta.buy}
					</Chip>
					<Chip
						aria-label="sell"
						radius="sm"
						size="sm"
						classNames={{
							base: 'h-5',
							content: 'text-description',
						}}
						startContent={<Image src="/assets/images/sell-icon.svg" alt="sell" />}
					>
						{meta.sell}
					</Chip>
					<Chip
						aria-label="order"
						radius="sm"
						size="sm"
						classNames={{
							base: 'h-5',
							content: 'text-description',
						}}
						startContent={<Image src="/assets/images/loudspeaker-icon.svg" alt="order" />}
					>
						{meta.order}
					</Chip>
				</div>
				<Button
					className="text-description w-6 min-w-6 h-6 min-h-6"
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
			</CardHeader>
			<CardBody>
				<ul className="flex flex-col gap-2 w-full">
					<li className="flex gap-1 items-center justify-between font-normal text-xs">
						<span className="text-description">{t('total-buy')}</span>
						<span className="text-success">${formatLargeNumber(total.buy)}</span>
					</li>
					<li className="flex gap-1 items-center justify-between font-normal text-xs">
						<span className="text-description">{t('total-sell')}</span>
						<span className="text-danger">${formatLargeNumber(total.sell)}</span>
					</li>
					<li className="flex gap-1 items-center justify-between font-normal text-xs">
						<span className="text-description">{t('total-volume')}</span>
						<span className="text-danger">${formatLargeNumber(total.volume)}</span>
					</li>
					<li className="flex gap-1 items-center justify-between font-normal text-xs mt-3">
						<span className="text-description">{t('order-success')}</span>
						<span className="text-description">
							<span className="text-success">{order.success}</span> / {order.total}
						</span>
					</li>
				</ul>
				{askMore && askMore.length > 0 && (
					<div className="flex flex-col gap-2 mt-3">
						<Divider className="mb-2" />
						<div className="flex gap-1 items-center">
							<Logo current="open" isActivatable={false} className="size-[14px]" />
							<span className="font-normal text-xs text-primary">{t('ask-more')}</span>
						</div>
						<Listbox aria-label="ask-more" className="bg-content1-300 rounded-md p-2" variant="light">
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
										<ListboxItem aria-label="divider" className="py-1">
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

export default OrderPopover;
