'use client';

import { createContext, use, useMemo, useState, useRef, useCallback } from 'react';
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
import type { Time, ISeriesApi, DeepPartial, TimeChartOptions, IChartApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

import { DisplayFilter as TDisplayFilter } from '@/libs/address/enums/display-filter.enum';
import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import type { DailyTokenPnl } from '@/libs/address/pipes/address.pipe';
import { theme as twTheme } from '@/themes/tw.theme';
import { cn } from '@/utils/cn';
import dayjs from '@/utils/dayjs';
import { truncateMiddle, roundDecimal, formatLargeNumber } from '@/utils/format';
import { isPositiveNumber, isNumber } from '@/utils/is';

import { Chart } from '../chart/trading-chart/chart';
import {
	MarkerTooltipProvider,
	MarkerTooltip,
	useMarkerTooltipStore,
} from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';
import CopyButton from '../commons/copy-button';
import { ErrorBoundary } from '../commons/error-boundary';
import DonkinPopover from '../donkin/popover';

export interface OrderHistoryDataItem {
	time: Time;
	value: number;
	isProfit?: boolean;
	tokens?: DailyTokenPnl[];
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
		<ButtonGroup variant="light" size="sm" aria-label="Display Filter">
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
						aria-label={t('balance-history')}
					/>
				}
				aria-label={t('balance-history')}
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
				aria-label={t('profit-loss')}
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
		<ScrollShadow orientation="horizontal" className="w-fit" aria-label="Interval Filter">
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
				<Tab
					key={IntervalFilter.OneWeek}
					title={IntervalFilter.OneWeek}
					className="px-2 py-0 h-6"
					aria-label={IntervalFilter.OneWeek}
				/>
				{/* <Tab key={IntervalFilter.OneMonth} title={IntervalFilter.OneMonth} className="px-2 py-0 h-6" aria-label={IntervalFilter.OneMonth} /> */}
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
					<Avatar size="md" className="w-[32px] h-[32px]" aria-label="Avatar" />
					<span className="flex items-center gap-2">
						<Skeleton className="w-20 h-4 rounded-full" />
					</span>
					<Divider orientation="vertical" className="h-4" />
					<Skeleton className="w-20 h-4 rounded-full" />
					<span className="flex items-center gap-1">
						<Skeleton className="w-20 h-4 rounded-full" />
					</span>
				</div>
			</div>
		);
	}

	const isPositive = isPositiveNumber(meta.profit) || (typeof meta.profit === 'string' && meta.profit.startsWith('+'));

	return (
		<div className="w-full flex md:items-center gap-4 justify-between md:justify-start">
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
			</div>
			<Divider orientation="vertical" className="h-4 hidden md:block" />
			<div className="flex md:items-center md:gap-4 flex-col md:flex-row">
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
		<div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
			<div className="flex items-center gap-4">
				<h3 className="text-[16px] font-normal text-white/65">{t('title')}</h3>
				<Divider orientation="vertical" className="h-4" />
				<DateFilter />
			</div>
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
	const { meta } = useOrderHistory();
	const tAskMore = useTranslations('donkin.ask-more');
	const t = useTranslations('address.order-history');
	const locale = useLocale();
	const [searchParams] = useAddressSearchParams();
	const openTooltip = useMarkerTooltipStore(state => state.openTooltip);
	const closeTooltip = useMarkerTooltipStore(state => state.closeTooltip);
	const [initOptions] = useState<DeepPartial<TimeChartOptions>>({
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
		// 設置右側價格軸顯示
		rightPriceScale: {
			visible: true,
			borderVisible: false,
		},
		// 設置左側價格軸顯示
		leftPriceScale: {
			visible: true,
			borderVisible: false,
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

	// 處理柱狀圖點擊
	const handleHistogramClick = useCallback(
		(chart: IChartApi, _series: ISeriesApi<'Histogram'>) => {
			chart.subscribeClick(param => {
				// 如果沒有點擊到具體位置，則返回
				if (!param.point || !param.time) {
					return;
				}

				const clickedData = profitLossData.find(item => {
					return dayjs.unix(item.time as number).isSame(dayjs.unix(param.time as number));
				});

				if (clickedData) {
					openTooltip({
						tooltip: (
							<DonkinPopover
								className="min-w-[200px]"
								onClose={closeTooltip}
								header={
									<section className="flex flex-col gap-1">
										<p className="text-xs font-normal text-foreground-400">
											{dayjs
												.unix(clickedData.time as number)
												.utc()
												.format('YYYY-MM-DD')}
										</p>
										<p className="text-xs font-normal text-foreground-500">
											{t('daily-profit-loss')}{' '}
											<span
												className={cn(
													'text-xs font-normal',
													isPositiveNumber(clickedData.value) ? 'text-success' : 'text-danger',
												)}
											>
												${isNumber(clickedData.value) ? formatLargeNumber(clickedData.value) : '0'}
											</span>
										</p>
									</section>
								}
								body={
									<section className="w-full">
										{(clickedData.tokens?.length ?? 0) > 8 ? (
											<ScrollShadow className="w-full h-[210px] max-h-[210px]">
												<ul className="flex flex-col gap-3">
													{clickedData.tokens?.map((item, index) => (
														<li key={`${item.symbol}-${index}`} className="text-xs font-normal flex justify-between">
															<span className="flex items-center gap-2">
																<Avatar src={item.url} className="w-4 h-4" />
																{item.symbol}
															</span>
															<span className="flex items-center gap-2">
																<span className="text-xs font-normal text-foreground-500">
																	<span className={cn(isPositiveNumber(item.buy) ? 'text-success' : '')}>
																		{item.buy}
																	</span>
																	/
																	<span className={cn(isPositiveNumber(item.sell) ? 'text-danger' : '')}>
																		{item.sell}
																	</span>
																</span>
															</span>
														</li>
													))}
												</ul>
											</ScrollShadow>
										) : (
											<ul className="flex flex-col gap-3">
												{clickedData.tokens?.map((item, index) => (
													<li key={`${item.symbol}-${index}`} className="text-xs font-normal flex justify-between">
														<span className="flex items-center gap-2">
															<Avatar src={item.url} className="w-4 h-4" />
															{item.symbol}
														</span>
														<span className="flex items-center gap-2">
															<span className="text-xs font-normal text-foreground-500">
																<span className={cn(isPositiveNumber(item.buy) ? 'text-success' : '')}>{item.buy}</span>
																/
																<span className={cn(isPositiveNumber(item.sell) ? 'text-danger' : '')}>
																	{item.sell}
																</span>
															</span>
														</span>
													</li>
												))}
											</ul>
										)}
										<Divider className="my-4" />
									</section>
								}
								askMore={[tAskMore('address-detail.history-analysis'), tAskMore('address-detail.current-holdings')]}
							/>
						),
						position: { x: param.point.x, y: param.point.y + 150 },
						container: chart.chartElement().parentElement || document.body,
					});
				}
			});
		},
		[profitLossData, openTooltip, closeTooltip, tAskMore, t],
	);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[342px]">
				<Spinner />
			</div>
		);
	}

	const isPositive =
		isPositiveNumber(meta?.profit) || (typeof meta?.profit === 'string' && meta?.profit.startsWith('+'));

	return (
		<Chart
			className="h-[55dvh]"
			initOptions={initOptions}
			onInit={c => {
				c.timeScale().fitContent();
			}}
			key={searchParams.interval}
		>
			{searchParams.display.includes(TDisplayFilter.BalanceHistory) && (
				<Series
					ref={areaSeriesRef}
					series={AreaSeries}
					data={balanceData}
					options={{
						lineColor: isPositive ? '#38AF75' : '#FF4D4F',
						topColor: isPositive ? 'rgba(69, 146, 109, 0.4)' : 'rgba(255, 77, 79, 0.4)',
						bottomColor: 'rgba(24, 25, 29, 0)',
						lineWidth: 2,
						priceFormat: {
							type: 'volume',
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
							type: 'volume',
							precision: 2,
							minMove: 0.01,
						},
						priceScaleId: 'left',
					}}
					onInit={(series, chart) => {
						if (chart) {
							handleHistogramClick(chart, series);
						}
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
