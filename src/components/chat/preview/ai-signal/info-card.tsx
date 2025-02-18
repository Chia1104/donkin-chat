'use client';

import { memo } from 'react';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card as HCard, CardBody, CardHeader as HCardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Progress } from '@heroui/progress';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslations } from 'next-intl';
import { useCopyToClipboard } from 'usehooks-ts';

import XIcon from '@/components/icons/x-icon';
import { roundDecimal } from '@/utils/format';

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
		change: string;
	};
}

interface CardProps extends MetaProps, StockProps, HotspotProps {
	display?: ('all' | 'meta' | 'stock' | 'hotspots')[];
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
		change: '10%',
	},
	hotspots: {
		x: 100,
		telegram: 50,
	},
};

const LinkIcon = (props: LinkIconProps) => {
	switch (props.provider) {
		case 'website':
			return <LanguageIcon sx={{ width: 8, height: 8 }} />;
		case 'x':
			return <XIcon className="size-2" />;
		case 'telegram':
			return <TelegramIcon sx={{ width: 8, height: 8 }} />;
		case 'copy':
			return <ContentCopyRoundedIcon sx={{ width: 8, height: 8 }} />;
	}
};

const CardHeader = memo((props: MetaProps) => {
	const [, copy] = useCopyToClipboard();
	return (
		<HCardHeader className="flex items-center gap-2 p-0 z-20">
			<Avatar src={props.meta.avatar} size="sm" className="w-6 h-6" />
			<h3 className="text-lg font-semibold">{props.meta.name}</h3>
			<div className="flex items-center gap-1 z-20">
				{Object.entries(props.link ?? {}).map(([key, value]) => (
					<Button
						as={key === 'copy' ? 'span' : 'a'}
						href={value}
						onPress={() => key === 'copy' && value && copy(value)}
						isIconOnly
						key={key}
						radius="full"
						size="sm"
						className="bg-background max-w-4 h-4 max-h-4 w-4 min-w-4 min-h-4 p-0"
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
		return (
			<CardBody className="border-1 border-divider rounded-lg prose prose-invert gap-4">
				<div>
					<h4 className="mt-0 text-sm font-normal">{t('card.x-hotspot')}</h4>
					<Progress
						classNames={{
							base: '',
							track: '',
							indicator: 'dc-bg-rainbow',
						}}
						value={hotspots.x}
						className="h-[6px]"
						radius="none"
					/>
				</div>
				<Divider className="my-0" />
				<div>
					<h4 className="mt-0 text-sm font-normal">{t('card.tg-hotspot')}</h4>
					<Progress
						classNames={{
							base: '',
							track: '',
							indicator: 'dc-bg-rainbow',
						}}
						value={hotspots.telegram}
						className="h-[6px]"
						radius="none"
					/>
				</div>
			</CardBody>
		);
	},
	(prev, next) => prev.hotspots.x === next.hotspots.x && prev.hotspots.telegram === next.hotspots.telegram,
);

const Stock = memo(
	({ stock }: StockProps) => {
		const t = useTranslations('preview.ai-signal');
		return (
			<CardBody className="border-1 border-divider rounded-lg gap-4 prose prose-invert">
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.marketCap')}</h4>${' '}
						{roundDecimal(stock.marketCap, 2)}
					</div>
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.price')}</h4>$ {roundDecimal(stock.price, 2)}
					</div>
				</div>
				<Divider className="my-0" />
				<div className="flex justify-between w-full gap-2">
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.pool')}</h4>$ {roundDecimal(stock.pool, 2)}
					</div>
					<div className="w-1/2">
						<h4 className="mt-0 text-sm font-normal">{t('card.stock.change')}</h4>
						{stock.change}
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

const InfoCard = ({ display = ['all'], ...props }: CardProps) => {
	return (
		<HCard isPressable className="bg-gradient-to-b from-[#FFFFFF1A] to-[#FFFFFF04] p-4 gap-5 relative w-full">
			{(display.includes('meta') || display.includes('all')) && <CardHeader {...props} />}
			{(display.includes('hotspots') || display.includes('all')) && <Hotspots {...props} />}
			{(display.includes('stock') || display.includes('all')) && <Stock {...props} />}
		</HCard>
	);
};

export default InfoCard;
