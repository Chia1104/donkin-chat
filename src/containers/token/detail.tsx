'use client';

import type { ReactNode } from 'react';
import { useMemo, useRef, memo, useCallback } from 'react';

import { CardBody } from '@heroui/card';
import { Checkbox } from '@heroui/checkbox';
import { Divider } from '@heroui/divider';
import { Spinner } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Skeleton } from '@heroui/skeleton';
import { Tabs, Tab } from '@heroui/tabs';
import { Tooltip } from '@heroui/tooltip';
import type { ManipulateType } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useInterval } from 'usehooks-ts';

import CopyButton from '@/components/commons/copy-button';
import { Head } from '@/components/commons/head';
import Candlestick from '@/components/token/candlestick';
import { FilterAction } from '@/components/token/filter-action';
import { HeaderPrimitive } from '@/components/token/info-card';
import { HotspotProgress } from '@/components/token/info-card';
import Card from '@/components/ui/card';
import { useGlobalSearchParams } from '@/hooks/useGlobalSearchParams';
import { useQueryOhlcv, useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import { useGetKolAlerts } from '@/libs/kol/hooks/useGetKolAlerts';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useQueryToken } from '@/libs/token/hooks/useQueryToken';
import { useQueryTokenPrice } from '@/libs/token/hooks/useQueryTokenPrice';
import { useQueryTokenSmartWallet } from '@/libs/token/hooks/useQueryTokenSmartWallet';
import { useQueryTransactions } from '@/libs/token/hooks/useQueryTransactions';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import type { Token } from '@/libs/token/pipes/token.pipe';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';
import dayjs from '@/utils/dayjs';
import { truncateMiddle, formatLargeNumber, roundDecimal, formatSmallNumber } from '@/utils/format';
import { isPositiveNumber, isNegativeNumber, isNumber } from '@/utils/is';

const Hotspot = ({ x, className }: { x: number; className?: string }) => {
	const t = useTranslations('preview.ai-signal');
	const [searchParams] = useGlobalSearchParams();
	x = searchParams.mock ? 60 : x;
	return (
		<CardBody className={cn('items-center', className)}>
			<HotspotProgress colorDirection="green-to-red" value={x} label={t('card.x-hotspot')} />
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
		<div className={cn('flex flex-col items-start justify-center gap-2 text-start bg-transparent', classNames?.base)}>
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
				base: 'items-center ml-0',
				label: 'items-center flex',
			}}
			isSelected={searchParams.mark}
			onValueChange={e => setSearchParams({ mark: e })}
		>
			{t('ranking.mark-smart')}
			<FilterAction />
		</Checkbox>
	);
};

const DateFilter = memo(() => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	return (
		<ScrollShadow orientation="horizontal" className="w-fit">
			<Tabs
				aria-label="filter time"
				size="sm"
				variant="light"
				selectedKey={searchParams.interval}
				onSelectionChange={key => {
					void setSearchParams({
						interval: key as IntervalFilter,
					});
				}}
			>
				{Object.values(IntervalFilter).map(interval => (
					<Tab key={interval} title={interval} className="px-2 py-0" />
				))}
			</Tabs>
		</ScrollShadow>
	);
});

const MetaInfo = ({ price, change, isPending }: { price: number; change: number | string; isPending?: boolean }) => {
	const isPositiveChange = isPositiveNumber(change) || (typeof change === 'string' && change.startsWith('+'));
	const isNegativeChange = isNegativeNumber(change) || (typeof change === 'string' && change.startsWith('-'));

	if (isPending) {
		return (
			<div className="flex items-end lg:items-center flex-col lg:flex-row">
				<Skeleton className="w-20 h-5 rounded-full mb-2 lg:mb-0 lg:mr-5" />
				<Skeleton className="w-10 h-3 rounded-full" />
			</div>
		);
	}

	return (
		<div className="flex items-end lg:items-center flex-col lg:flex-row min-w-fit">
			<h3 className="text-[22px] font-medium lg:mr-5">{`$ ${formatSmallNumber(price ?? 0)}`}</h3>
			<span
				className={cn(
					'text-xs flex items-center gap-1',
					isPositiveChange ? 'text-success' : isNegativeChange ? 'text-danger' : 'text-foreground-500',
				)}
			>
				{isNumber(change) ? (isPositiveChange ? `+${roundDecimal(change, 2)}` : roundDecimal(change, 2)) : change}%{' '}
				{isPositiveChange ? (
					<span className="i-material-symbols-trending-up size-3 text-success" />
				) : (
					<span className="i-material-symbols-trending-down size-3 text-danger" />
				)}
			</span>
		</div>
	);
};

const Header = memo(
	({ data, isLoading }: { data?: Token; isLoading: boolean }) => {
		const isOpen = useGlobalStore(state => state.donkin.isOpen);
		return (
			<div className="flex items-center gap-5">
				<HeaderPrimitive
					avatarProps={{
						size: 'lg',
						className: 'min-w-8 min-h-8 w-8 h-8',
					}}
					classNames={{
						label: ['text-[22px] font-normal max-w-full'],
						labelWrapper: ['items-start gap-0 w-full max-w-[150px] md:max-w-[250px]', isOpen && 'md:max-w-[150px]'],
					}}
					isLoading={isLoading}
					meta={{
						name: data?.name ?? '',
						avatar: data?.logo_uri ?? '',
						chain: data?.symbol ?? '',
						symbol: data?.symbol ?? '',
						token: data?.address ?? '',
					}}
					experimental={{
						hoverToShowLabel: true,
					}}
				/>
			</div>
		);
	},
	(prev, next) => {
		return prev.data === next.data && prev.isLoading === next.isLoading;
	},
);

const Detail = ({ simplify = false }: { simplify?: boolean }) => {
	const t = useTranslations('preview.ai-signal');
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const tToken = useTranslations('token');
	const params = useParams<{ chain: string; token: string }>();
	const queryResult = useQueryToken(params.token);
	const queryPrice = useQueryTokenPrice(params.token, {
		refetchInterval: 10_000,
	});
	const querySmartWalletCount = useQueryTokenSmartWallet(params.token, {
		refetchInterval: 60_000,
	});
	const [searchParams] = useTokenSearchParams();
	const currentUnix = useRef(dayjs().unix());
	const { data: kolAlerts, isLoading: isKolAlertsLoading } = useGetKolAlerts(params.token, {
		gcTime: 0,
		staleTime: Infinity,
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	const intervalSnapshot = useRef<IntervalFilter>(searchParams.interval);

	const timeFrom = useMemo(() => {
		switch (searchParams.interval) {
			case IntervalFilter.OneMinute:
				return dayjs.unix(currentUnix.current).subtract(12, 'hour').unix();
			case IntervalFilter.FiveMinutes:
				return dayjs.unix(currentUnix.current).subtract(1, 'day').unix();
			case IntervalFilter.FifteenMinutes:
				return dayjs.unix(currentUnix.current).subtract(1, 'week').unix();
			case IntervalFilter.ThirtyMinutes:
				return dayjs.unix(currentUnix.current).subtract(1, 'week').unix();
			case IntervalFilter.OneHour:
				return dayjs.unix(currentUnix.current).subtract(2, 'week').unix();
			case IntervalFilter.FourHours:
				return dayjs.unix(currentUnix.current).subtract(2, 'month').unix();
			case IntervalFilter.OneDay:
				return dayjs.unix(currentUnix.current).subtract(6, 'month').unix();
			case IntervalFilter.OneWeek:
				return dayjs.unix(currentUnix.current).subtract(6, 'month').unix();
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
			staleTime: Infinity,
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);

	const { mutate: updateOhlcv, isPending, data: updateOhlcvData } = useMutationOhlcv();

	const handleUpdateOhlcv = useCallback(() => {
		if (ohlcv.isLoading || isPending) {
			return;
		}

		const timeTo = dayjs().unix();

		const getSubtract = (interval: IntervalFilter): [number, string] => {
			switch (interval) {
				case IntervalFilter.OneMinute:
					return [1, 'minute'];
				case IntervalFilter.FiveMinutes:
					return [5, 'minute'];
				case IntervalFilter.FifteenMinutes:
					return [15, 'minute'];
				case IntervalFilter.ThirtyMinutes:
					return [30, 'minute'];
				case IntervalFilter.OneHour:
					return [1, 'hour'];
				case IntervalFilter.FourHours:
					return [4, 'hour'];
				case IntervalFilter.OneDay:
					return [1, 'day'];
				case IntervalFilter.OneWeek:
					return [1, 'week'];
				default:
					return [1, 'hour'];
			}
		};

		const [subtract, unit] = getSubtract(searchParams.interval);
		const timeFrom = dayjs()
			.subtract(subtract, unit as ManipulateType)
			.unix();

		updateOhlcv({
			data: {
				address: params.token,
				type: searchParams.interval,
				time_from: timeFrom,
				time_to: timeTo,
			},
		});
		currentUnix.current = timeTo;
	}, [isPending, ohlcv.isLoading, params.token, searchParams.interval, updateOhlcv]);

	useInterval(handleUpdateOhlcv, 10_000);

	const ohlcvData = useMemo(() => {
		if (!ohlcv?.data || !Array.isArray(ohlcv?.data)) {
			return [];
		}
		return ohlcv.data;
	}, [ohlcv.data]);

	const updateData = useMemo(() => {
		if (!updateOhlcvData || !Array.isArray(updateOhlcvData) || intervalSnapshot.current !== searchParams.interval) {
			intervalSnapshot.current = searchParams.interval;
			return undefined;
		}
		intervalSnapshot.current = searchParams.interval;
		return updateOhlcvData[0];
	}, [updateOhlcvData, searchParams.interval]);

	const { data: transactions, isLoading: isTransactionsLoading } = useQueryTransactions(
		{
			token_address: params.token,
			start_time: dayjs.unix(timeFrom).format('YYYY-MM-DD'),
			end_time: dayjs.unix(currentUnix.current).format('YYYY-MM-DD'),
			interval: searchParams.interval,
		},
		{
			gcTime: 0,
			staleTime: Infinity,
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);

	const diff = useMemo(() => {
		if (!queryResult.data?.created_at) {
			return '-';
		}
		const base = dayjs(queryResult.data?.created_at);
		// min
		if (dayjs().diff(base, 'minutes') < 60) {
			return `${dayjs().diff(base, 'minutes')}m`;
		}
		// hour
		if (dayjs().diff(base, 'hours') > 24) {
			return `${dayjs().diff(base, 'days')}d`;
		}
		// month
		else if (dayjs().diff(base, 'days') > 30) {
			return `${dayjs().diff(base, 'months')}M`;
		}
		// year
		else if (dayjs().diff(base, 'days') > 365) {
			return `${dayjs().diff(base, 'years')}y`;
		}

		return `${dayjs().diff(base, 'hours')}h`;
	}, [queryResult.data?.created_at]);

	const headTitle = useMemo(() => {
		const isPositiveChange = isPositiveNumber(queryPrice.data?.price_change_24h);
		const isNegativeChange = isNegativeNumber(queryPrice.data?.price_change_24h);
		const updownSymbol = isPositiveChange ? '↑' : isNegativeChange ? '↓' : '';
		return `${queryResult.data?.symbol} ${updownSymbol} $${formatSmallNumber(queryPrice.data?.price ?? 0)}`;
	}, [queryResult.data?.symbol, queryPrice.data?.price_change_24h, queryPrice.data?.price]);

	return (
		<>
			<Head title={headTitle} />
			<div className="w-full h-full flex flex-col">
				<div className={cn('flex flex-col gap-6 w-full')}>
					<div
						className={cn(
							'flex flex-col gap-6 w-full',
							simplify && (isOpen ? 'xl:flex-row xl:justify-between' : 'lg:flex-row lg:justify-between'),
						)}
					>
						<div
							className={cn(
								'flex flex-col lg:flex-row items-start gap-1 justify-between w-full lg:w-fit lg:justify-start',
								simplify &&
									(isOpen
										? 'xl:flex-row xl:items-center xl:gap-5 xl:justify-start lg:flex-col'
										: 'lg:flex-row lg:items-center lg:gap-5 lg:justify-start'),
							)}
						>
							<div className="flex items-center gap-5 justify-between lg:justify-start w-full lg:w-fit">
								<Header data={queryResult.data} isLoading={queryResult.isLoading} />
								<Divider orientation="vertical" className="h-4 hidden lg:block" />
								<MetaInfo
									price={queryPrice.data?.price ?? 0}
									change={queryPrice.data?.price_change_24h ?? 0}
									isPending={queryPrice.isLoading}
								/>
							</div>
							<span className="flex items-center gap-3">
								<p className="text-success text-[12px] font-normal">{diff}</p>
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
								<CopyButton content={params.token} />
							</span>
						</div>
						<Card
							className={cn(
								'flex flex-col gap-2 lg:flex-row lg:justify-between p-0 bg-transparent items-center min-w-fit',
							)}
						>
							{!simplify && <Hotspot x={0} className="w-full lg:max-w-[25%] h-fit lg:h-full justify-center" />}
							<CardBody
								className={cn(
									'grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:max-w-[50%]',
									simplify && (isOpen ? 'xl:grid-cols-3 xl:max-w-full lg:max-w-full' : 'lg:grid-cols-3 lg:max-w-full'),
								)}
							>
								<Stock
									label={t('card.stock.marketCap')}
									value={`$ ${formatLargeNumber(queryResult.data?.market_cap ?? 0)}`}
									isPending={queryResult.isLoading}
								/>
								<Stock
									classNames={{
										base: 'lg:pl-4',
									}}
									label={t('card.stock.pool')}
									value={`$ ${formatLargeNumber(queryResult.data?.liquidity ?? 0)}`}
									isPending={queryResult.isLoading}
								/>
								{!simplify && (
									<Stock
										classNames={{
											base: 'lg:pl-4',
										}}
										label={tToken('holder')}
										value={formatLargeNumber(0)}
										isPending={queryResult.isLoading}
									/>
								)}
								<Stock
									classNames={{
										base: 'lg:pl-4',
									}}
									label={tToken('wallets')}
									value={
										querySmartWalletCount.data?.smart_wallet_count
											? formatLargeNumber(querySmartWalletCount.data?.smart_wallet_count)
											: '-'
									}
									isPending={querySmartWalletCount.isLoading}
								/>
							</CardBody>
						</Card>
					</div>
					<Divider orientation="horizontal" />
					<section className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
						<DateFilter />
						<Marker />
					</section>
					{ohlcv.isLoading || isKolAlertsLoading || isTransactionsLoading ? (
						<div className="flex items-center justify-center w-full h-[55dvh]">
							<Spinner />
						</div>
					) : (
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
							updateData={updateData}
							isPending={ohlcv.isLoading || isKolAlertsLoading || isTransactionsLoading}
							isMetaPending={queryResult.isLoading}
							kolAlerts={kolAlerts}
							transactions={transactions}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default Detail;
