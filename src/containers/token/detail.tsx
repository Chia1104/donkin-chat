'use client';

import type { ReactNode } from 'react';

import { ScrollShadow } from '@heroui/scroll-shadow';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { HotspotProgress } from '@/components/chat/preview/ai-signal/info-card';
import Candlestick from '@/components/token/candlestick';
import RankingSection from '@/components/token/ranking-section';
import Card from '@/components/ui/card';

const Hotspot = () => {
	const t = useTranslations('preview.ai-signal');
	return (
		<Card className="col-span-2 flex flex-col gap-4 justify-center">
			<HotspotProgress
				classNames={{
					labelWrapper: 'min-w-[48%] mb-0',
					progressWrapper: 'min-w-[52%] max-w-[52%]',
				}}
				className="flex flex-row items-center justify-between"
				label={t('card.x-hotspot')}
				value={6}
			/>
			<HotspotProgress
				classNames={{
					labelWrapper: 'min-w-[48%] mb-0',
					progressWrapper: 'min-w-[52%] max-w-[52%]',
				}}
				className="flex flex-row items-center justify-between"
				label={t('card.tg-hotspot')}
				value={9}
			/>
		</Card>
	);
};

const Stock = ({ label, value }: { label: ReactNode; value: string }) => {
	return (
		<Card className="flex flex-col items-start justify-center gap-4 text-start bg-transparent">
			<h5 className="text-foreground-500">{label}</h5>
			<span>{value}</span>
		</Card>
	);
};

const Detail = () => {
	const t = useTranslations('preview.ai-signal');
	const tToken = useTranslations('token');
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-full h-full flex flex-col"
		>
			<ScrollShadow className="w-full h-[calc(100vh-72px)]">
				<div className="flex flex-col gap-5 w-full">
					<Candlestick />
					<RankingSection />
					<div className="grid grid-cols-6 gap-2">
						<Hotspot />
						<Card className="col-span-4 grid grid-cols-4 gap-2">
							<Stock label={t('card.stock.marketCap')} value="$326.4M" />
							<Stock label={t('card.stock.pool')} value="$120.1M" />
							<Stock label={tToken('holder')} value="36.36K" />
							<Stock label={tToken('wallets')} value="982.1K" />
						</Card>
					</div>
				</div>
			</ScrollShadow>
		</motion.div>
	);
};

export default Detail;
