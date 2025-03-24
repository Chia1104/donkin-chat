'use client';

import type { ReactNode } from 'react';

import { CardBody } from '@heroui/card';
import { Checkbox } from '@heroui/checkbox';
import { Divider } from '@heroui/divider';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { HeaderPrimitive } from '@/components/chat/preview/ai-signal/info-card';
import { HotspotProgress } from '@/components/chat/preview/ai-signal/info-card';
import Candlestick from '@/components/token/candlestick';
import { FilterAction } from '@/components/token/filter-action';
import Card from '@/components/ui/card';
import { useQueryToken } from '@/libs/token/hooks/useQueryToken';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { useChatStore } from '@/stores/chat';
import { cn } from '@/utils/cn';
import { truncateMiddle, formatLargeNumber } from '@/utils/format';

const Hotspot = ({ x, telegram }: { x: number; telegram: number }) => {
	const t = useTranslations('preview.ai-signal');
	return (
		<CardBody className="grid-cols-2 grid gap-4 col-span-2 items-center">
			<HotspotProgress
				classNames={{
					labelWrapper: 'mb-0',
					label: 'py-2',
				}}
				className="flex flex-col"
				label={t('card.x-hotspot')}
				value={x}
			/>
			<HotspotProgress
				classNames={{
					labelWrapper: 'mb-0',
					label: 'py-2',
				}}
				className="flex flex-col"
				label={t('card.tg-hotspot')}
				value={telegram}
			/>
		</CardBody>
	);
};

const Stock = ({
	label,
	value,
	classNames,
}: {
	label: ReactNode;
	value: ReactNode;
	classNames?: {
		base?: string;
		label?: string;
		value?: string;
	};
}) => {
	return (
		<div
			className={cn(
				'flex flex-col items-start justify-center gap-2 text-start bg-transparent border-l-1 border-divider pl-4',
				classNames?.base,
			)}
		>
			<h4 className={cn('text-foreground-500 text-xs font-normal leading-3', classNames?.label)}>{label}</h4>
			<span className={cn('text-sm font-normal leading-[14px]', classNames?.value)}>{value}</span>
		</div>
	);
};

const Marker = () => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const t = useTranslations('token');

	return (
		<Checkbox
			size="sm"
			classNames={{
				base: 'items-center',
				label: 'items-center flex mt-1',
			}}
			isSelected={searchParams.mark}
			onValueChange={e => setSearchParams({ mark: e })}
		>
			{t('ranking.mark-smart')}
			<FilterAction />
		</Checkbox>
	);
};

const Detail = () => {
	const t = useTranslations('preview.ai-signal');
	const tToken = useTranslations('token');
	const params = useParams<{ chain: string; token: string }>();
	const queryResult = useQueryToken(params.token);
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);

	return (
		<section
			className={cn('p-5 overflow-y-auto h-[calc(100vh-72px)]', !isPreviewOnly ? 'w-full lg:w-2/3 pr-0' : 'w-full')}
		>
			<div className="w-full h-full flex flex-col">
				<ScrollShadow className="w-full h-[calc(100vh-72px)]">
					<div className="flex flex-col gap-5 w-full">
						<header className="flex justify-between items-center">
							<section className="flex items-center gap-5">
								<HeaderPrimitive
									avatarProps={{
										size: 'lg',
										className: 'min-w-8 min-h-8 w-8 h-8',
									}}
									classNames={{
										label: 'text-[22px] font-normal mr-2',
										labelWrapper: 'flex-row items-center',
									}}
									injects={{
										afterLabel: (
											<span className="flex items-center gap-3">
												<Divider orientation="vertical" className="h-3" />
												<p className="text-success text-[12px] font-normal">2h</p>
												<p className="text-[12px] font-normal">
													{truncateMiddle(
														queryResult.data?.address ?? '',
														queryResult.data?.address ? queryResult.data?.address.length / 3 : 5,
													)}
												</p>
											</span>
										),
									}}
									isLoading={queryResult.isLoading}
									meta={{
										name: queryResult.data?.name ?? '',
										avatar: queryResult.data?.logo_uri ?? '',
										chain: queryResult.data?.symbol ?? '',
										token: queryResult.data?.address ?? '',
									}}
								/>
							</section>
							<section>
								<Marker />
							</section>
						</header>
						<Candlestick />
						<Card className="grid grid-cols-6 gap-2">
							<Hotspot x={0} telegram={0} />
							<CardBody className="col-span-4 grid grid-cols-4 gap-2">
								<Stock
									label={t('card.stock.marketCap')}
									value={`$ ${formatLargeNumber(queryResult.data?.market_cap ?? 0)}`}
								/>
								<Stock
									label={t('card.stock.pool')}
									value={`$ ${formatLargeNumber(queryResult.data?.liquidity ?? 0)}`}
								/>
								<Stock label={tToken('holder')} value={formatLargeNumber(0)} />
								<Stock label={tToken('wallets')} value={formatLargeNumber(0)} />
							</CardBody>
						</Card>
					</div>
				</ScrollShadow>
			</div>
		</section>
	);
};

export default Detail;
