'use client';

import { createContext, use, useMemo, useState, useRef } from 'react';
import type { PropsWithChildren } from 'react';

import { Avatar } from '@heroui/avatar';
import { Button, ButtonGroup } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Skeleton } from '@heroui/skeleton';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { Tooltip } from '@heroui/tooltip';
import { ColorType, HistogramSeries, AreaSeries } from 'lightweight-charts';
import type { Time, ISeriesApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

import { DisplayFilter as TDisplayFilter } from '@/libs/address/enums/display-filter.enum';
import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import { theme as twTheme } from '@/themes/tw.theme';
import { cn } from '@/utils/cn';
import { truncateMiddle, roundDecimal, formatLargeNumber } from '@/utils/format';
import { isPositiveNumber, isNumber } from '@/utils/is';

import { Chart } from '../chart/trading-chart/chart';
import { MarkerTooltipProvider, MarkerTooltip } from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';
import CopyButton from '../commons/copy-button';
import { ErrorBoundary } from '../commons/error-boundary';
import DonkinPopover from '../donkin/popover';

export interface OrderHistoryDataItem {
	time: Time;
	value: number;
	isProfit?: boolean;
}

export interface OrderHistoryProps {
	meta?: {
		avatar?: string;
		address: string;
		volume: number | string;
		profit: number | string;
	};
	win?: {
		rate: number | string;
	};
	profit?: {
		rate: number;
		amount: number;
	};
	balanceData: OrderHistoryDataItem[];
	profitLossData: OrderHistoryDataItem[];
	isPending?: boolean;
	isMetaPending?: boolean;
}

const OrderHistoryContext = createContext<OrderHistoryProps | null>(null);

const OrderHistoryProvider = ({ children, ...props }: PropsWithChildren<OrderHistoryProps>) => {
	return <OrderHistoryContext value={props}>{children}</OrderHistoryContext>;
};

const useOrderHistory = () => {
	const context = use(OrderHistoryContext);
	if (!context) {
		throw new Error('useOrderHistory must be used within OrderHistoryProvider');
	}
	return context;
};

const DisplayFilter = () => {
	const [searchParams, setSearchParams] = useAddressSearchParams();
	const t = useTranslations('address.order-history');

	return (
		<ButtonGroup variant="light" size="sm">
			<Button
				className="text-description px-2 py-0"
				onPress={() => {
					void setSearchParams({
						display: searchParams.display.includes(TDisplayFilter.BalanceHistory)
							? searchParams.display.filter(item => item !== TDisplayFilter.BalanceHistory)
							: [...searchParams.display, TDisplayFilter.BalanceHistory],
					});
				}}
				startContent={
					<Image
						src={
							searchParams.display.includes(TDisplayFilter.BalanceHistory)
								? '/assets/images/balance.svg'
								: '/assets/images/balance-disabled.svg'
						}
						alt="balance"
						width={16}
						height={16}
						removeWrapper
						className="rounded-none"
					/>
				}
			>
				{t('balance-history')}
			</Button>
			<Button
				className="text-description px-2 py-0"
				onPress={() => {
					void setSearchParams({
						display: searchParams.display.includes(TDisplayFilter.ProfitLoss)
							? searchParams.display.filter(item => item !== TDisplayFilter.ProfitLoss)
							: [...searchParams.display, TDisplayFilter.ProfitLoss],
					});
				}}
				startContent={
					<Image
						src={
							searchParams.display.includes(TDisplayFilter.ProfitLoss)
								? '/assets/images/profit.svg'
								: '/assets/images/profit-disabled.svg'
						}
						alt="profit"
						width={8}
						height={8}
						removeWrapper
						className="rounded-none"
					/>
				}
			>
				{t('profit-loss')}
			</Button>
		</ButtonGroup>
	);
};

const DateFilter = () => {
	const [searchParams, setSearchParams] = useAddressSearchParams();
	const { isPending, isMetaPending } = useOrderHistory();

	return (
		<ScrollShadow orientation="horizontal" className="w-fit">
			<Tabs
				aria-label="interval"
				size="sm"
				variant="light"
				selectedKey={searchParams.interval}
				onSelectionChange={key => {
					void setSearchParams({
						interval: key as IntervalFilter,
					});
				}}
				isDisabled={isPending || isMetaPending}
			>
				<Tab key={IntervalFilter.OneWeek} title={IntervalFilter.OneWeek} className="px-2 py-0 h-6" />
				<Tab key={IntervalFilter.OneMonth} title={IntervalFilter.OneMonth} className="px-2 py-0 h-6" />
			</Tabs>
		</ScrollShadow>
	);
};

const Meta = () => {
	const { meta } = useOrderHistory();
	const tAskMore = useTranslations('donkin.ask-more');
	const { isMetaPending } = useOrderHistory();

	if (isMetaPending || !meta) {
		return (
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-4">
					<Avatar size="md" className="w-[32px] h-[32px]" />
					<span className="flex items-center gap-2">
						<Skeleton className="w-20 h-4 rounded-full" />
					</span>
					<Divider orientation="vertical" className="h-4" />
					<p className="text-[22px] font-normal">
						<Skeleton className="w-20 h-4 rounded-full" />
					</p>
					<span className="flex items-center gap-1">
						<Skeleton className="w-20 h-4 rounded-full" />
					</span>
				</div>
				<DateFilter />
			</div>
		);
	}

	const isPositive = isPositiveNumber(meta.profit) || (typeof meta.profit === 'string' && meta.profit.startsWith('+'));

	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-4">
				<Avatar src={meta.avatar} size="md" className="w-[32px] h-[32px]" />
				<span className="flex items-center gap-2">
					<Tooltip
						classNames={{
							content: 'bg-transparent shadow-none p-0',
						}}
						content={
							<DonkinPopover
								className="w-[220px]"
								askMore={[tAskMore('address-detail.history-analysis'), tAskMore('address-detail.current-holdings')]}
							/>
						}
					>
						<p className="text-[22px] font-normal">{truncateMiddle(meta.address ?? '', 10)}</p>
					</Tooltip>
					<CopyButton content={meta.address} />
				</span>
				<Divider orientation="vertical" className="h-4" />
				<p className="text-[22px] font-normal">
					${isNumber(meta.volume) ? formatLargeNumber(meta.volume, 2) : meta.volume}
				</p>
				<span className="flex items-center gap-1">
					<p className={cn('text-xs font-normal', isPositive ? 'text-success' : 'text-danger')}>
						{isPositive && '+'}
						{isNumber(meta.profit) ? roundDecimal(meta.profit, 2) : meta.profit}%
					</p>
					{isPositive ? (
						<span className="i-material-symbols-trending-up size-3 text-success" />
					) : (
						<span className="i-material-symbols-trending-down size-3 text-danger" />
					)}
				</span>
			</div>
		</div>
	);
};
const Header = () => {
	const t = useTranslations('address.order-history');
	const { win, profit, isMetaPending } = useOrderHistory();

	return (
		<div className="flex items-center gap-4 w-full">
			<h3 className="text-[16px] font-normal text-white/65">{t('title')}</h3>
			<Divider orientation="vertical" className="h-4" />
			<DateFilter />
			<div className="flex items-center gap-4">
				<span className="flex items-center gap-2">
					<p className="text-description text-xs font-normal">{t('win-rate')}</p>
					{isMetaPending || !win ? (
						<Skeleton className="w-20 h-4 rounded-full" />
					) : (
						<p className="text-sm font-normal">{isNumber(win.rate) ? roundDecimal(win.rate, 2) : '-'}%</p>
					)}
				</span>
				<span className="flex items-center gap-2">
					<p className="text-description text-xs font-normal">{t('profit-loss-rate')}</p>
					{isMetaPending || !profit ? (
						<Skeleton className="w-20 h-4 rounded-full" />
					) : (
						<p className="text-sm font-normal">
							{isNumber(profit.rate) ? roundDecimal(profit.rate, 2) : '-'}% (
							{isPositiveNumber(profit.amount) ? '+' : ''}
							{isNumber(profit.amount) ? formatLargeNumber(profit.amount) : profit.amount})
						</p>
					)}
				</span>
			</div>
		</div>
	);
};

const OrderChart = () => {
	const locale = useLocale();
	const [searchParams] = useAddressSearchParams();
	const [initOptions] = useState({
		autoSize: true,
		layout: {
			textColor: 'rgba(255, 255, 255, 0.25)',
			background: { type: ColorType.Solid, color: 'transparent' },
			attributionLogo: false,
		},
		grid: {
			vertLines: {
				color: 'rgba(255, 255, 255, 0.06)',
			},
			horzLines: {
				color: 'rgba(255, 255, 255, 0.06)',
			},
		},
		localization: {
			locale,
		},
		timeScale: {
			timeVisible: true,
		},
	});
	const areaSeriesRef = useRef<ISeriesApi<'Area'>>(null);
	const histogramSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

	const { balanceData, profitLossData, isPending } = useOrderHistory();

	const formattedHistogramData = useMemo(() => {
		return profitLossData.map(item => ({
			time: item.time,
			value: item.value,
			color: item.isProfit ? twTheme.extend.colors.buy.DEFAULT : twTheme.extend.colors.sell.DEFAULT,
		}));
	}, [profitLossData]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[342px]">
				<Spinner />
			</div>
		);
	}

	return (
		<Chart
			className="h-[55dvh]"
			initOptions={initOptions}
			onInit={c => {
				c.timeScale().fitContent();
			}}
		>
			{searchParams.display.includes(TDisplayFilter.BalanceHistory) && (
				<Series
					ref={areaSeriesRef}
					series={AreaSeries}
					data={balanceData}
					options={{
						lineColor: '#38AF75',
						topColor: 'rgba(69, 146, 109, 0.4)',
						bottomColor: 'rgba(24, 25, 29, 0)',
						lineWidth: 2,
						priceFormat: {
							type: 'price',
							precision: 2,
							minMove: 0.01,
						},
					}}
				/>
			)}
			{searchParams.display.includes(TDisplayFilter.ProfitLoss) && (
				<Series
					ref={histogramSeriesRef}
					series={HistogramSeries}
					data={formattedHistogramData}
					options={{
						priceFormat: {
							type: 'price',
							precision: 2,
							minMove: 0.01,
						},
					}}
				/>
			)}
		</Chart>
	);
};

const OrderHistory = (props: OrderHistoryProps) => {
	return (
		<OrderHistoryProvider {...props}>
			<section className="w-full rounded-lg flex flex-col gap-6">
				<Meta />
				<Divider orientation="horizontal" className="w-full" />
				<Header />
				<ErrorBoundary>
					<MarkerTooltipProvider>
						<OrderChart />
						<DisplayFilter />
						<MarkerTooltip />
					</MarkerTooltipProvider>
				</ErrorBoundary>
			</section>
		</OrderHistoryProvider>
	);
};

export default OrderHistory;
