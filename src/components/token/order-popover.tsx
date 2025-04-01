'use client';

import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { useTranslations } from 'next-intl';

import { formatLargeNumber } from '@/utils/format';

import DonkinPopover from '../donkin/popover';

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
		<DonkinPopover
			onClose={onClose}
			askMore={askMore}
			onAskMore={onAskMore}
			header={
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
			}
			body={
				<div className="flex flex-col gap-3 w-full mb-3">
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
					<Divider />
				</div>
			}
		/>
	);
};

export default OrderPopover;
