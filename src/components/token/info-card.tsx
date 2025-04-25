'use client';

import type { ReactNode } from 'react';
import { memo, useState } from 'react';

import type { AvatarProps } from '@heroui/avatar';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import type { CardProps as HCardProps } from '@heroui/card';
import { Card as HCard, CardBody, CardHeader as HCardHeader } from '@heroui/card';
import { Image } from '@heroui/image';
import { Skeleton } from '@heroui/skeleton';
import { Tooltip } from '@heroui/tooltip';
import { useClipboard } from '@heroui/use-clipboard';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import XIcon from '@/components/icons/x-icon';
import { ProgressSlider } from '@/components/ui/progress-slider';
import { useAskToken } from '@/libs/ai/hooks/useAskToken';
import { useChatStore } from '@/stores/chat';
import { cn } from '@/utils/cn';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isNumber, isPositiveNumber, isNegativeNumber } from '@/utils/is';

import DonkinPopover from '../donkin/popover';

type LinkProvider = 'website' | 'x' | 'telegram' | 'copy';

interface MetaProps {
	meta: {
		name: string;
		symbol: string;
		avatar?: string;
		chain: string;
		token: string;
	};
	link?: Record<LinkProvider, string | undefined>;
	isLoading?: boolean;
}

export interface HeaderPrimitiveProps extends MetaProps {
	avatarProps?: AvatarProps;
	classNames?: {
		linkWrapper?: string;
		labelWrapper?: string;
		label?: string;
	};
	injects?: {
		afterLabel?: ReactNode;
	};
	isLoading?: boolean;
	onAskMore?: (item: string) => void;
}

interface HotspotProps {
	hotspots?: {
		x?: number;
		telegram?: number;
	};
	isLoading?: boolean;
}

interface StockProps {
	stock: {
		// 市值
		marketCap: number;
		// 價格
		price: number;
		// 池子
		pool: number;
		// 24h漲跌
		change: string | number;
	};
	isLoading?: boolean;
}

interface CardProps extends MetaProps, StockProps, HotspotProps {
	display?: ('all' | 'meta' | 'stock' | 'hotspots')[];
	onPress?: (meta: MetaProps) => void;
	cardProps?: HCardProps;
	isLoading?: boolean;
}

interface LinkIconProps {
	provider: LinkProvider;
	link: string;
	copied?: boolean;
}

export const LinkIcon = (props: LinkIconProps) => {
	switch (props.provider) {
		case 'website':
			return <span className="text-default-600 i-material-symbols-language size-3" />;
		case 'x':
			return <XIcon className="size-2" />;
		case 'telegram':
			return <span className="text-default-600 i-material-symbols-telegram size-3" />;
		case 'copy':
			return props.copied ? (
				<span className="text-default-600 i-material-symbols-done-all size-3" />
			) : (
				<span className="text-default-600 i-material-symbols-content-copy-outline rotate-180 size-3" />
			);
	}
};

export const HeaderPrimitive = (props: HeaderPrimitiveProps) => {
	const { copied, copy } = useClipboard();
	const isPending = useChatStore(state => state.isPending);
	const askToken = useAskToken(props.meta.symbol);
	const [isError, setIsError] = useState(false);

	return (
		<>
			<Avatar
				aria-label="avatar"
				size="sm"
				fallback={!isError ? <Skeleton className="w-12 h-12 rounded-full" /> : null}
				showFallback={isError}
				name={props.meta.name}
				imgProps={{
					crossOrigin: 'anonymous',
					onError: () => setIsError(true),
				}}
				onError={() => setIsError(true)}
				{...props.avatarProps}
				className={cn('w-12 h-12 min-w-12 min-h-12', props.avatarProps?.className)}
				src={!isError ? props.meta.avatar : ''}
			/>
			<div
				className={cn('flex flex-col gap-2 items-start w-full max-w-[calc(100%-3rem)]', props.classNames?.labelWrapper)}
			>
				{props.isLoading ? (
					<Skeleton className="w-full max-w-[100px] h-3 rounded-full" />
				) : (
					<Tooltip
						content={<DonkinPopover disabled={isPending} className="w-[220px]" {...askToken} />}
						classNames={{
							base: 'shadow-none',
							content: 'bg-transparent shadow-none p-0',
						}}
					>
						<h3 className={cn('text-base font-semibold flex max-w-full', props.classNames?.label)}>
							<span className="line-clamp-1 break-words">{props.meta.name}</span>
						</h3>
					</Tooltip>
				)}
				{props.injects?.afterLabel}
				<div className={cn('flex items-center gap-1 z-20', props.classNames?.linkWrapper)}>
					{Object.entries(props.link ?? {})
						.filter(([_, value]) => value)
						.map(([key, value]) => (
							<Button
								aria-label={key}
								as={key === 'copy' ? 'span' : 'a'}
								href={value}
								onPress={() => key === 'copy' && value && copy(value)}
								isIconOnly
								key={key}
								radius="full"
								size="sm"
								className="bg-background max-w-5 h-5 max-h-5 w-5 min-w-5 min-h-5 p-0"
							>
								{value && <LinkIcon provider={key as LinkProvider} link={value} copied={copied} />}
							</Button>
						))}
				</div>
			</div>
		</>
	);
};

export const CardHeader = memo((props: MetaProps) => {
	return (
		<HCardHeader aria-label="card-header" className="flex items-center gap-2 p-0 z-20">
			<HeaderPrimitive {...props} />
		</HCardHeader>
	);
});

export const HotspotProgress = ({
	label,
	value,
	className,
	classNames,
	colorDirection = 'red-to-green',
}: {
	label: ReactNode;
	value: number;
	className?: string;
	classNames?: {
		labelWrapper?: string;
		label?: string;
		progressWrapper?: string;
	};
	colorDirection?: 'red-to-green' | 'green-to-red';
}) => {
	const convert = (value: number) => {
		if (!isNumber(value)) {
			return 0;
		}
		// 若是 value 以 10 為單位，則轉換為 100 為單位, 並四捨五入至小數點, 9 -> 90 or 90 -> 90
		return value % 10 === 0 ? value : Math.round(value * 10);
	};
	const isHot = (value: number) => convert(value) >= 90;
	return (
		<div className={cn('w-full', className)}>
			<div className={cn('flex items-center gap-1', classNames?.labelWrapper)}>
				<h4 className={cn('m-0 text-xs font-normal text-description', classNames?.label)}>{label}</h4>
				{isHot(value) ? (
					<Image
						aria-label="hot"
						as={NextImage}
						width={24}
						height={24}
						removeWrapper
						src="/assets/images/hot.svg"
						alt="hot"
						className="m-0"
					/>
				) : null}
				<span className="text-default-600 i-material-symbols-info-outline size-4" />
			</div>
			<div className={cn('w-full flex items-center justify-between gap-1', classNames?.progressWrapper)}>
				<div className="w-[90%]">
					<ProgressSlider
						aria-label="hotspot"
						value={convert(value)}
						segments={10}
						classNames={{
							base: 'h-[6px]',
							segment: 'h-[6px]',
						}}
						colorDirection={colorDirection}
					/>
				</div>
				<span className="text-sm font-normal">{roundDecimal(convert(value) / 10, 0)}</span>
			</div>
		</div>
	);
};

export const Hotspots = memo(
	({ hotspots }: HotspotProps) => {
		const t = useTranslations('preview.ai-signal');
		return (
			<CardBody aria-label="Hotspots" className="rounded-none prose prose-invert gap-4 p-0 mb-2">
				{hotspots?.x != null ? (
					<HotspotProgress label={t('card.x-hotspot')} value={hotspots.x} colorDirection="green-to-red" />
				) : null}
				{hotspots?.telegram != null ? (
					<HotspotProgress label={t('card.tg-hotspot')} value={hotspots.telegram} colorDirection="green-to-red" />
				) : null}
			</CardBody>
		);
	},
	(prev, next) => prev.hotspots?.x === next.hotspots?.x && prev.hotspots?.telegram === next.hotspots?.telegram,
);

export const Stock = memo(
	({ stock, isLoading }: StockProps) => {
		const t = useTranslations('preview.ai-signal');
		const isPositiveChange =
			isPositiveNumber(stock.change) || (typeof stock.change === 'string' && stock.change.startsWith('+'));
		const isNegativeChange =
			isNegativeNumber(stock.change) || (typeof stock.change === 'string' && stock.change.startsWith('-'));
		return (
			<CardBody aria-label="Stock" className="rounded-none gap-4 prose prose-invert p-0">
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="m-0 text-xs font-normal text-description">{t('card.stock.marketCap')}</h4>
						{isLoading ? (
							<Skeleton className="w-full max-w-[50px] h-3 mt-2 rounded-full mb-2" />
						) : (
							<span className="text-sm font-normal]">{`$ ${formatLargeNumber(stock.marketCap)}`}</span>
						)}
					</div>
					<div className="w-1/2">
						<h4 className="m-0 text-xs font-normal text-description">{t('card.stock.price')}</h4>
						{isLoading ? (
							<Skeleton className="w-full max-w-[50px] h-3 mt-2 rounded-full mb-2" />
						) : (
							<span className="text-sm font-normal">{`$ ${formatLargeNumber(stock.price)}`}</span>
						)}
					</div>
				</div>
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="m-0 text-xs font-normal text-description">{t('card.stock.pool')}</h4>
						{isLoading ? (
							<Skeleton className="w-full max-w-[50px] h-3 mt-2 rounded-full mb-2" />
						) : (
							<span className="text-sm font-normal">{`$ ${formatLargeNumber(stock.pool)}`}</span>
						)}
					</div>
					<div className="w-1/2">
						<h4 className="m-0 text-xs font-normal text-description">{t('card.stock.change')}</h4>
						{isLoading ? (
							<Skeleton className="w-full max-w-[50px] h-3 mt-2 rounded-full mb-2" />
						) : (
							<span
								className={cn(
									'text-sm font-normal',
									isPositiveChange && 'text-success',
									isNegativeChange && 'text-danger',
								)}
							>
								{isNumber(stock.change)
									? isPositiveChange
										? `+${roundDecimal(stock.change, 2)}`
										: roundDecimal(stock.change, 2)
									: stock.change}
								%
							</span>
						)}
					</div>
				</div>
			</CardBody>
		);
	},
	(prev, next) => {
		return (
			prev.stock.marketCap === next.stock.marketCap &&
			prev.stock.price === next.stock.price &&
			prev.stock.pool === next.stock.pool &&
			prev.stock.change === next.stock.change
		);
	},
);

const InfoCard = ({ display = ['all'], onPress, cardProps, ...props }: CardProps) => {
	return (
		<HCard
			aria-label="info-card"
			isPressable
			className={cn(
				'shadow-none p-4 gap-5 relative w-full border-none rounded-sm bg-[#FFFFFF08]',
				cardProps?.className,
			)}
			onPress={() => onPress && onPress(props)}
			radius="sm"
			{...cardProps}
		>
			{(display.includes('meta') || display.includes('all')) && <CardHeader {...props} />}
			{(display.includes('hotspots') || display.includes('all')) && <Hotspots {...props} />}
			{(display.includes('stock') || display.includes('all')) && <Stock {...props} />}
		</HCard>
	);
};

export default InfoCard;
