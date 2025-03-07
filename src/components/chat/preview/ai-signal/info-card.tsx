'use client';

import type { ReactNode } from 'react';
import { memo } from 'react';

import type { AvatarProps } from '@heroui/avatar';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card as HCard, CardBody, CardHeader as HCardHeader } from '@heroui/card';
import { Image } from '@heroui/image';
import { Progress } from '@heroui/progress';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { useCopyToClipboard } from 'usehooks-ts';

import XIcon from '@/components/icons/x-icon';
import { cn } from '@/utils/cn';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isNumber, isPositiveNumber, isNegativeNumber } from '@/utils/is';

type LinkProvider = 'website' | 'x' | 'telegram' | 'copy';

interface MetaProps {
	meta: {
		name: string;
		avatar?: string;
		chain: string;
		token: string;
	};
	link?: Record<LinkProvider, string | undefined>;
}

export interface HeaderPrimitiveProps extends MetaProps {
	avatarProps?: AvatarProps;
	classNames?: {
		linkWrapper?: string;
		label?: string;
	};
	injects?: {
		afterLabel?: ReactNode;
	};
}

interface HotspotProps {
	hotspots: {
		x: number;
		telegram: number;
	};
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
}

interface CardProps extends MetaProps, StockProps, HotspotProps {
	display?: ('all' | 'meta' | 'stock' | 'hotspots')[];
	onPress?: (meta: MetaProps) => void;
}

interface LinkIconProps {
	provider: LinkProvider;
	link: string;
}

export const MOCK_DATA: CardProps = {
	meta: {
		name: 'Solana',
		avatar: 'https://solana.com/favicon.ico',
		chain: 'sol',
		token: '0x1234567890',
	},
	link: {
		website: 'https://solana.com',
		x: 'https://x.com',
		telegram: 'https://t.me/solana',
		copy: 'https://solana.com',
	},
	stock: {
		marketCap: 100000000,
		price: 100,
		pool: 1000000,
		change: '+10%',
	},
	hotspots: {
		x: 90,
		telegram: 50,
	},
};

export const LinkIcon = (props: LinkIconProps) => {
	switch (props.provider) {
		case 'website':
			return <LanguageIcon sx={{ width: 12, height: 12 }} />;
		case 'x':
			return <XIcon className="size-2" />;
		case 'telegram':
			return <TelegramIcon sx={{ width: 12, height: 12 }} />;
		case 'copy':
			return <ContentCopyRoundedIcon sx={{ width: 12, height: 12 }} />;
	}
};

export const HeaderPrimitive = (props: HeaderPrimitiveProps) => {
	const [, copy] = useCopyToClipboard();

	return (
		<>
			<Avatar
				aria-label="avatar"
				size="sm"
				{...props.avatarProps}
				className={cn('w-6 h-6', props.avatarProps?.className)}
				src={props.meta.avatar}
			/>
			<h3 className={cn('text-lg font-semibold', props.classNames?.label)}>{props.meta.name}</h3>
			{props.injects?.afterLabel}
			<div className={cn('flex items-center gap-1 z-20', props.classNames?.linkWrapper)}>
				{Object.entries(props.link ?? {}).map(([key, value]) => (
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
						{value && <LinkIcon provider={key as LinkProvider} link={value} />}
					</Button>
				))}
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
}: {
	label: ReactNode;
	value: number;
	className?: string;
	classNames?: {
		labelWrapper?: string;
		label?: string;
		progressWrapper?: string;
	};
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
			<div className={cn('flex items-center mb-2 gap-1', classNames?.labelWrapper)}>
				<h4 className={cn('m-0 text-sm font-normal', classNames?.label)}>{label}</h4>
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
				<InfoOutlinedIcon sx={{ width: 14, height: 14 }} />
			</div>
			<div className={cn('w-full flex items-center justify-between gap-1', classNames?.progressWrapper)}>
				<div className="w-[90%]">
					<Progress
						aria-label="tg-hotspot"
						classNames={{
							base: '',
							track: '',
							indicator: 'dc-bg-rainbow',
						}}
						value={convert(value)}
						className="h-[6px]"
						radius="none"
					/>
				</div>
				<span>{roundDecimal(convert(value) / 10, 0)}</span>
			</div>
		</div>
	);
};

export const Hotspots = memo(
	({ hotspots }: HotspotProps) => {
		const t = useTranslations('preview.ai-signal');
		return (
			<CardBody aria-label="Hotspots" className="rounded-lg prose prose-invert gap-4 p-0">
				<HotspotProgress label={t('card.x-hotspot')} value={hotspots.x} />
				<HotspotProgress label={t('card.tg-hotspot')} value={hotspots.telegram} />
			</CardBody>
		);
	},
	(prev, next) => prev.hotspots.x === next.hotspots.x && prev.hotspots.telegram === next.hotspots.telegram,
);

export const Stock = memo(
	({ stock }: StockProps) => {
		const t = useTranslations('preview.ai-signal');
		const isPositiveChange =
			isPositiveNumber(stock.change) || (typeof stock.change === 'string' && stock.change.startsWith('+'));
		const isNegativeChange =
			isNegativeNumber(stock.change) || (typeof stock.change === 'string' && stock.change.startsWith('-'));
		return (
			<CardBody aria-label="Stock" className="rounded-lg gap-4 prose prose-invert p-0">
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.marketCap')}</h4>
						<span className="text-lg">{`$ ${formatLargeNumber(stock.marketCap)}`}</span>
					</div>
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.price')}</h4>
						<span className="text-lg">{`$ ${formatLargeNumber(stock.price)}`}</span>
					</div>
				</div>
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.pool')}</h4>
						<span className="text-lg">{`$ ${formatLargeNumber(stock.pool)}`}</span>
					</div>
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.change')}</h4>
						<span className={cn('text-lg', isPositiveChange && 'text-success', isNegativeChange && 'text-danger')}>
							{isNumber(stock.change) ? roundDecimal(stock.change, 2) : stock.change}
						</span>
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

const InfoCard = ({ display = ['all'], onPress, ...props }: CardProps) => {
	return (
		<HCard
			aria-label="info-card"
			isPressable
			className="shadow-none p-4 gap-5 relative w-full border-none"
			onPress={() => onPress && onPress(props)}
		>
			{(display.includes('meta') || display.includes('all')) && <CardHeader {...props} />}
			{(display.includes('hotspots') || display.includes('all')) && <Hotspots {...props} />}
			{(display.includes('stock') || display.includes('all')) && <Stock {...props} />}
		</HCard>
	);
};

export default InfoCard;
