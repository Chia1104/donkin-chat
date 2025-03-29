'use client';

import { memo, createContext, use, useMemo, useState, useCallback } from 'react';
import type { PropsWithChildren } from 'react';

import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { ColorType, HistogramSeries, CandlestickSeries } from 'lightweight-charts';
import type { Time, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';

import { experimental_useTailwindTheme as useTailwindTheme } from '@/hooks/useTailwindTheme';
import { useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import dayjs from '@/utils/dayjs';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isPositiveNumber, isNegativeNumber, isNumber } from '@/utils/is';

import { Chart as TradingChart } from '../chart/trading-chart/chart';
import { MarkerTooltipProvider, MarkerTooltip } from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';

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
	const twTheme = useTailwindTheme();

	const { mutate: fetchMoreOhlcv, isPending: isFetchMoreOhlcvPending } = useMutationOhlcv();
	const { data, isPending, meta, query } = useCandlestick();
	const [_timeFrom, setTimeFrom] = useState(query.time_from);
	const [_timeTo, setTimeTo] = useState(query.time_to);
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

	const handleSubscribeVisibleLogicalRangeSuccess = useCallback(
		(options: {
			candlestickSeries?: ISeriesApi<'Candlestick'> | null;
			volumeSeries?: ISeriesApi<'Histogram'> | null;
			newTimeFrom: number;
			newTimeTo: number;
			data: Data[];
		}) => {
			setTimeFrom(options.newTimeFrom);
			setTimeTo(options.newTimeTo);
			const data = options.data;
			if (options.candlestickSeries) {
				options.candlestickSeries.setData(
					data.map(item => ({
						value: item.volume,
						time: item.unix as Time,
						open: item.open,
						high: item.high,
						low: item.low,
						close: item.close,
					})),
				);
			}
			if (options.volumeSeries) {
				options.volumeSeries.setData(
					data.map(item => ({
						value: item.volume,
						time: item.unix as Time,
						color: item.close > item.open ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.sell.disabled,
						open: item.open,
						high: item.high,
						low: item.low,
						close: item.close,
					})),
				);
			}
		},
		[twTheme.theme.colors.buy.disabled, twTheme.theme.colors.sell.disabled],
	);

	const _handleSubscribeVisibleLogicalRangeChange = useCallback(
		(options: {
			chart?: IChartApi | null;
			candlestickSeries?: ISeriesApi<'Candlestick'> | null;
			volumeSeries?: ISeriesApi<'Histogram'> | null;
			timeFrom: number;
			timeTo: number;
		}) => {
			if (!options.chart) {
				console.warn('chart is not defined');
				return;
			}
			options.chart.timeScale().subscribeVisibleLogicalRangeChange(logicalRange => {
				if (!logicalRange || isFetchMoreOhlcvPending) {
					return;
				}
				if (logicalRange.from < 10) {
					const numberBarsToLoad = 50 - logicalRange.from;

					const newTimeFrom = handleGenerateTimeWithInterval(options.timeFrom, query.type, numberBarsToLoad);
					const newTimeTo = handleGenerateTimeWithInterval(options.timeTo, query.type, 1);
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
								handleSubscribeVisibleLogicalRangeSuccess({
									candlestickSeries: options.candlestickSeries,
									volumeSeries: options.volumeSeries,
									newTimeFrom,
									newTimeTo,
									data: _data.data.map(item => ({
										value: item.v,
										time: item.unixTime as Time,
										open: item.o,
										high: item.h,
										low: item.l,
										close: item.c,
										volume: item.v,
										unix: item.unixTime,
									})),
								});
							},
						},
					);
				}
			});
		},
		[
			fetchMoreOhlcv,
			handleGenerateTimeWithInterval,
			handleSubscribeVisibleLogicalRangeSuccess,
			isFetchMoreOhlcvPending,
			meta.address,
			query.type,
		],
	);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[55dvh]">
				<Spinner />
			</div>
		);
	}

	return (
		<TradingChart className="h-[55dvh]" initOptions={initOptions}>
			<Series
				series={CandlestickSeries}
				data={initData.map(item => ({
					...item,
					color: undefined,
				}))}
				options={{
					upColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
					downColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
					borderVisible: false,
					wickUpColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
					wickDownColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
				}}
			/>
			<Series
				series={HistogramSeries}
				data={initData}
				options={{
					priceFormat: {
						type: 'volume',
					},
					priceScaleId: '',
				}}
				onInit={series => {
					series.priceScale().applyOptions({
						scaleMargins: {
							top: 0.8,
							bottom: 0,
						},
					});
				}}
			/>
		</TradingChart>
	);
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
