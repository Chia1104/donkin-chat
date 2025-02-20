'use client';

import { memo } from 'react';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card as HCard, CardBody, CardHeader as HCardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
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
	};
	link?: Record<LinkProvider, string | undefined>;
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
	onPress?: () => void;
}

interface LinkIconProps {
	provider: LinkProvider;
	link: string;
}

export const MOCK_DATA: CardProps = {
	meta: {
		name: 'Solana',
		avatar: 'https://solana.com/favicon.ico',
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

const LinkIcon = (props: LinkIconProps) => {
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

const CardHeader = memo((props: MetaProps) => {
	const [, copy] = useCopyToClipboard();
	return (
		<HCardHeader aria-label="card-header" className="flex items-center gap-2 p-0 z-20">
			<Avatar aria-label="avatar" src={props.meta.avatar} size="sm" className="w-6 h-6" />
			<h3 className="text-lg font-semibold">{props.meta.name}</h3>
			<div className="flex items-center gap-1 z-20">
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
		</HCardHeader>
	);
});

const Hotspots = memo(
	({ hotspots }: HotspotProps) => {
		const t = useTranslations('preview.ai-signal');
		const convert = (value: number) => {
			if (!isNumber(value)) {
				return 0;
			}
			// 若是 value 以 10 為單位，則轉換為 100 為單位, 並四捨五入至小數點, 9 -> 90 or 90 -> 90
			return value % 10 === 0 ? value : Math.round(value * 10);
		};
		const isHot = (value: number) => convert(value) >= 90;
		return (
			<CardBody aria-label="Hotspots" className="border-1 border-divider rounded-lg prose prose-invert gap-4 px-4 py-5">
				<div className="w-full">
					<div className="flex items-center mb-2 gap-1">
						<h4 className="m-0 text-sm font-normal">{t('card.x-hotspot')}</h4>
						{isHot(hotspots.x) ? (
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
					<div className="w-full flex items-center justify-between gap-1">
						<div className="w-[90%]">
							<Progress
								aria-label="x-hotspot"
								classNames={{
									base: '',
									track: '',
									indicator: 'dc-bg-rainbow',
								}}
								value={convert(hotspots.x)}
								className="h-[6px]"
								radius="none"
							/>
						</div>
						<span>{roundDecimal(convert(hotspots.x) / 10, 0)}</span>
					</div>
				</div>
				<Divider className="my-0" />
				<div className="w-full">
					<div className="flex items-center mb-2 gap-1">
						<h4 className="m-0 text-sm font-normal">{t('card.tg-hotspot')}</h4>
						{isHot(hotspots.telegram) ? (
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
					<div className="w-full flex items-center justify-between gap-1">
						<div className="w-[90%]">
							<Progress
								aria-label="tg-hotspot"
								classNames={{
									base: '',
									track: '',
									indicator: 'dc-bg-rainbow',
								}}
								value={convert(hotspots.telegram)}
								className="h-[6px]"
								radius="none"
							/>
						</div>
						<span>{roundDecimal(convert(hotspots.telegram) / 10, 0)}</span>
					</div>
				</div>
			</CardBody>
		);
	},
	(prev, next) => prev.hotspots.x === next.hotspots.x && prev.hotspots.telegram === next.hotspots.telegram,
);

const Stock = memo(
	({ stock }: StockProps) => {
		const t = useTranslations('preview.ai-signal');
		const isPositiveChange = isPositiveNumber(stock.change) || stock.change.startsWith('+');
		const isNegativeChange = isNegativeNumber(stock.change) || stock.change.startsWith('-');
		return (
			<CardBody aria-label="Stock" className="border-1 border-divider rounded-lg gap-4 prose prose-invert px-4 py-5">
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
				<Divider className="my-0" />
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
			className="bg-gradient-to-t from-[#FFFFFF1A] to-[#FFFFFF04] p-4 gap-5 relative w-full"
			onPress={onPress}
		>
			{(display.includes('meta') || display.includes('all')) && <CardHeader {...props} />}
			{(display.includes('hotspots') || display.includes('all')) && <Hotspots {...props} />}
			{(display.includes('stock') || display.includes('all')) && <Stock {...props} />}
		</HCard>
	);
};

export default InfoCard;
