'use client';

import { memo, createContext, use, useMemo, useRef, useState, useCallback } from 'react';
import type { PropsWithChildren } from 'react';

import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { CandlestickSeries, ColorType, HistogramSeries } from 'lightweight-charts';
import type { Time, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';

import { experimental_useTailwindTheme as useTailwindTheme } from '@/hooks/useTailwindTheme';
import { useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import dayjs from '@/utils/dayjs';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isPositiveNumber, isNegativeNumber, isNumber } from '@/utils/is';

import { MarkerTooltipProvider, MarkerTooltip } from '../chart/plugins/clickable-marker/marker-tooltip';
import type { TradingChartRef } from '../chart/trading-chart';
import TradingChart from '../chart/trading-chart';

interface Data {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	unix: number;
}

interface CandlestickProps {
	meta: {
		price: number;
		change: number | string;
		address: string;
	};
	query: {
		type: IntervalFilter;
		time_from: number;
		time_to: number;
	};
	data: Data[];
	isPending?: boolean;
	isMetaPending?: boolean;
}

const CandlestickContext = createContext<CandlestickProps | null>(null);

const CandlestickProvider = ({ children, ...props }: PropsWithChildren<CandlestickProps>) => {
	return <CandlestickContext value={props}>{children}</CandlestickContext>;
};

const useCandlestick = () => {
	const context = use(CandlestickContext);
	if (!context) {
		throw new Error('CandlestickProvider must be used within CandlestickProvider');
	}
	return context;
};

const DateFilter = memo(() => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	return (
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
	);
});

const MetaInfo = () => {
	const { meta, isMetaPending } = useCandlestick();
	const isPositiveChange =
		isPositiveNumber(meta.change) || (typeof meta.change === 'string' && meta.change.startsWith('+'));
	const isNegativeChange =
		isNegativeNumber(meta.change) || (typeof meta.change === 'string' && meta.change.startsWith('-'));
	return (
		<div className="flex items-center gap-2">
			<h3 className="text-[22px] font-medium">
				{!isMetaPending ? `$ ${formatLargeNumber(meta.price)}` : <Skeleton className="w-20 h-5 rounded-full" />}
			</h3>
			{!isMetaPending ? (
				<Chip
					color={isPositiveChange ? 'success' : isNegativeChange ? 'danger' : 'default'}
					variant="flat"
					radius="sm"
					size="sm"
				>
					{isNumber(meta.change)
						? isPositiveChange
							? `+${roundDecimal(meta.change, 2)}`
							: roundDecimal(meta.change, 2)
						: meta.change}
					%
				</Chip>
			) : (
				<Skeleton className="w-10 h-3 rounded-full" />
			)}
		</div>
	);
};

const Chart = () => {
	const locale = useLocale();
	const [searchParams] = useTokenSearchParams();
	const [initOptions] = useState({
		autoSize: true,
		layout: {
			textColor: '#9B9EAB',
			background: { type: ColorType.Solid, color: 'transparent' },
			attributionLogo: false,
		},
		grid: {
			vertLines: {
				color: 'transparent',
			},
			horzLines: {
				color: 'transparent',
			},
		},
		localization: {
			locale,
		},
		timeScale: {
			timeVisible: true,
		},
	});
	const chartRef = useRef<TradingChartRef>(null);
	const twTheme = useTailwindTheme();

	const { mutate: fetchMoreOhlcv, isPending: isFetchMoreOhlcvPending } = useMutationOhlcv();
	const { data, isPending, meta, query } = useCandlestick();
	const [timeFrom, setTimeFrom] = useState(query.time_from);
	const [timeTo, setTimeTo] = useState(query.time_to);
	const initData = useMemo(() => {
		return data.map(item => ({
			...item,
			value: item.volume,
			time: item.unix as Time,
			color: item.close > item.open ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.sell.disabled,
		}));
	}, [data, twTheme.theme.colors.buy.disabled, twTheme.theme.colors.sell.disabled]);

	const handleGenerateTimeWithInterval = useCallback(
		(current: number, interval: IntervalFilter, range: number): number => {
			switch (interval) {
				case IntervalFilter.OneMinute:
					return dayjs.unix(current).subtract(range, 'minutes').unix();
				case IntervalFilter.FiveMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 5, 'minutes')
						.unix();
				case IntervalFilter.FifteenMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 15, 'minutes')
						.unix();
				case IntervalFilter.ThirtyMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 30, 'minutes')
						.unix();
				case IntervalFilter.OneHour:
					return dayjs.unix(current).subtract(range, 'hours').unix();
				case IntervalFilter.FourHours:
					return dayjs
						.unix(current)
						.subtract(range * 4, 'hours')
						.unix();
				case IntervalFilter.OneDay:
					return dayjs.unix(current).subtract(range, 'days').unix();
				case IntervalFilter.OneWeek:
					return dayjs.unix(current).subtract(range, 'weeks').unix();
				default:
					return current;
			}
		},
		[],
	);

	const _handleSubscribeVisibleLogicalRangeChange = useCallback(
		(chart: IChartApi, candlestickSeries: ISeriesApi<'Candlestick'>, volumeSeries: ISeriesApi<'Histogram'>) => {
			chart.timeScale().subscribeVisibleLogicalRangeChange(logicalRange => {
				if (!logicalRange || isFetchMoreOhlcvPending) {
					return;
				}
				if (logicalRange.from < 10) {
					const numberBarsToLoad = 50 - logicalRange.from;

					const newTimeFrom = handleGenerateTimeWithInterval(timeFrom, query.type, numberBarsToLoad);
					const newTimeTo = handleGenerateTimeWithInterval(timeTo, query.type, 1);
					fetchMoreOhlcv(
						{
							data: {
								address: meta.address,
								type: query.type,
								time_from: newTimeFrom,
								time_to: newTimeTo,
							},
						},
						{
							onSuccess(_data) {
								setTimeFrom(newTimeFrom);
								setTimeTo(newTimeTo);
								const data = _data.data;
								candlestickSeries.setData(
									data.map(item => ({
										value: item.v,
										time: item.unixTime as Time,
										open: item.o,
										high: item.h,
										low: item.l,
										close: item.c,
									})),
								);
								volumeSeries.setData(
									data.map(item => ({
										value: item.v,
										time: item.unixTime as Time,
										color: item.c > item.o ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.sell.disabled,
										open: item.o,
										high: item.h,
										low: item.l,
										close: item.c,
									})),
								);
							},
						},
					);
				}
			});
		},
		[
			fetchMoreOhlcv,
			handleGenerateTimeWithInterval,
			isFetchMoreOhlcvPending,
			meta.address,
			query.type,
			timeFrom,
			timeTo,
			twTheme.theme.colors.buy.disabled,
			twTheme.theme.colors.sell.disabled,
		],
	);

	const handleInit = useCallback(
		(chart: IChartApi) => {
			const candlestickSeries = chart.addSeries(CandlestickSeries, {
				upColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
				downColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
				borderVisible: false,
				wickUpColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
				wickDownColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
			});
			const volumeSeries = chart.addSeries(HistogramSeries, {
				priceFormat: {
					type: 'volume',
				},
				priceScaleId: '', // set as an overlay by setting a blank priceScaleId
			});
			volumeSeries.priceScale().applyOptions({
				scaleMargins: {
					top: 0.8, // highest point of the series will be 70% away from the top
					bottom: 0,
				},
			});

			candlestickSeries.setData(
				initData.map(item => ({
					...item,
					color: undefined,
				})),
			);
			volumeSeries.setData(initData);

			// handleSubscribeVisibleLogicalRangeChange(chart, candlestickSeries, volumeSeries);
		},
		[
			initData,
			// handleSubscribeVisibleLogicalRangeChange,
			searchParams.mark,
			twTheme.theme.colors.buy.DEFAULT,
			twTheme.theme.colors.buy.disabled,
			twTheme.theme.colors.sell.DEFAULT,
			twTheme.theme.colors.sell.disabled,
		],
	);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[55dvh]">
				<Spinner />
			</div>
		);
	}

	return <TradingChart ref={chartRef} className="h-[55dvh]" onInit={handleInit} initOptions={initOptions} />;
};

const Candlestick = (props: CandlestickProps) => {
	return (
		<CandlestickProvider {...props}>
			<section className="w-full rounded-lg flex flex-col gap-10">
				<header className="flex items-center justify-between">
					<MetaInfo />
					<DateFilter />
				</header>
				<MarkerTooltipProvider>
					<Chart />
					<MarkerTooltip />
				</MarkerTooltipProvider>
			</section>
		</CandlestickProvider>
	);
};

export default Candlestick;
