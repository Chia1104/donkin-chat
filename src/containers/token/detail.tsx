'use client';

import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';

import { CardBody } from '@heroui/card';
import { Checkbox } from '@heroui/checkbox';
import { Divider } from '@heroui/divider';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Skeleton } from '@heroui/skeleton';
import { Tooltip } from '@heroui/tooltip';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { ErrorBoundary } from '@/components/commons/error-boundary';
import DonkinPopover from '@/components/donkin/popover';
import Candlestick from '@/components/token/candlestick';
import { FilterAction } from '@/components/token/filter-action';
import { HeaderPrimitive } from '@/components/token/info-card';
import { HotspotProgress } from '@/components/token/info-card';
import Card from '@/components/ui/card';
import { useQueryOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useQueryToken } from '@/libs/token/hooks/useQueryToken';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { cn } from '@/utils/cn';
import dayjs from '@/utils/dayjs';
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
	isPending,
}: {
	label: ReactNode;
	value: ReactNode;
	classNames?: {
		base?: string;
		label?: string;
		value?: string;
	};
	isPending?: boolean;
}) => {
	return (
		<div
			className={cn(
				'flex flex-col items-start justify-center gap-2 text-start bg-transparent border-l-1 border-divider pl-4',
				classNames?.base,
			)}
		>
			<h4 className={cn('text-foreground-500 text-xs font-normal leading-3', classNames?.label)}>{label}</h4>
			{isPending ? (
				<Skeleton className="w-10 h-3 rounded-full" />
			) : (
				<span className={cn('text-sm font-normal leading-[14px]', classNames?.value)}>{value}</span>
			)}
		</div>
	);
};

const Marker = () => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const t = useTranslations('token');

	return (
		<Checkbox
			radius="sm"
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
	const tAskMore = useTranslations('donkin.ask-more');
	const tToken = useTranslations('token');
	const params = useParams<{ chain: string; token: string }>();
	const queryResult = useQueryToken(params.token);
	const [searchParams] = useTokenSearchParams();
	const currentUnix = useRef(dayjs().unix());

	const timeFrom = useMemo(() => {
		switch (searchParams.interval) {
			case IntervalFilter.OneMinute:
				return dayjs.unix(currentUnix.current).subtract(6, 'hour').unix();
			case IntervalFilter.FiveMinutes:
				return dayjs.unix(currentUnix.current).subtract(6, 'hour').unix();
			case IntervalFilter.FifteenMinutes:
				return dayjs.unix(currentUnix.current).subtract(6, 'hour').unix();
			case IntervalFilter.ThirtyMinutes:
				return dayjs.unix(currentUnix.current).subtract(12, 'hour').unix();
			case IntervalFilter.OneHour:
				return dayjs.unix(currentUnix.current).subtract(1, 'week').unix();
			case IntervalFilter.FourHours:
				return dayjs.unix(currentUnix.current).subtract(1, 'month').unix();
			case IntervalFilter.OneDay:
				return dayjs.unix(currentUnix.current).subtract(1, 'month').unix();
			case IntervalFilter.OneWeek:
				return dayjs.unix(currentUnix.current).subtract(1, 'month').unix();
			default:
				return dayjs.unix(currentUnix.current).subtract(1, 'day').unix();
		}
	}, [searchParams.interval]);

	const ohlcv = useQueryOhlcv(
		{
			data: {
				address: params.token,
				type: searchParams.interval,
				time_from: timeFrom,
				time_to: currentUnix.current,
			},
		},
		{
			gcTime: 0,
		},
	);

	const ohlcvData = useMemo(() => {
		if (!ohlcv?.data || !Array.isArray(ohlcv?.data)) {
			return [];
		}
		return ohlcv.data;
	}, [ohlcv.data]);

	return (
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
											<Tooltip
												content={dayjs(queryResult.data?.created_at).format('YYYY-MM-DD HH:mm:ss')}
												showArrow
												radius="sm"
												classNames={{
													content: 'text-[10px] font-normal',
												}}
											>
												<p className="text-[12px] font-normal">
													{truncateMiddle(
														queryResult.data?.address ?? '',
														queryResult.data?.address ? queryResult.data?.address.length / 3 : 5,
													)}
												</p>
											</Tooltip>
										</span>
									),
									nameTooltip: (
										<DonkinPopover
											onAskMore={console.log}
											className="w-[220px]"
											askMore={[
												tAskMore('token-name.basic-info'),
												tAskMore('token-name.price-analysis'),
												tAskMore('token-name.kol-order'),
												tAskMore('token-name.smart-wallet'),
											]}
										/>
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
					<ErrorBoundary>
						<Candlestick
							meta={{
								price: queryResult.data?.price ?? 0,
								change: queryResult.data?.change ?? 0,
								address: params.token,
							}}
							query={{
								type: searchParams.interval,
								time_from: timeFrom,
								time_to: currentUnix.current,
							}}
							data={ohlcvData}
							isPending={ohlcv.isLoading}
							isMetaPending={queryResult.isLoading}
						/>
					</ErrorBoundary>
					<Card className="grid grid-cols-6 gap-2">
						<Hotspot x={0} telegram={0} />
						<CardBody className="col-span-4 grid grid-cols-4 gap-2">
							<Stock
								label={t('card.stock.marketCap')}
								value={`$ ${formatLargeNumber(queryResult.data?.market_cap ?? 0)}`}
								isPending={queryResult.isLoading}
							/>
							<Stock
								label={t('card.stock.pool')}
								value={`$ ${formatLargeNumber(queryResult.data?.liquidity ?? 0)}`}
								isPending={queryResult.isLoading}
							/>
							<Stock label={tToken('holder')} value={formatLargeNumber(0)} isPending={queryResult.isLoading} />
							<Stock label={tToken('wallets')} value={formatLargeNumber(0)} isPending={queryResult.isLoading} />
						</CardBody>
					</Card>
				</div>
			</ScrollShadow>
		</div>
	);
};

export default Detail;
