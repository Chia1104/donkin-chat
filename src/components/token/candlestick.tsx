'use client';

import { memo, createContext, use, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import type { PropsWithChildren } from 'react';

import { Chip } from '@heroui/chip';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Skeleton } from '@heroui/skeleton';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { useQueryClient } from '@tanstack/react-query';
import { ColorType, HistogramSeries, CandlestickSeries, createTextWatermark } from 'lightweight-charts';
import type { Time, ISeriesApi } from 'lightweight-charts';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import type { OlcvResponseDTO } from '@/libs/birdeye/hooks/useQueryOhlcv';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { theme as twTheme } from '@/themes/tw.theme';
import dayjs from '@/utils/dayjs';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isPositiveNumber, isNegativeNumber, isNumber } from '@/utils/is';

import { useChart } from '../chart/trading-chart/chart';
import { Chart as TradingChart } from '../chart/trading-chart/chart';
import { MarkerTooltipProvider, MarkerTooltip } from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';
import { useSeries } from '../chart/trading-chart/series';
import { SubscribeVisibleLogicalRange } from '../chart/trading-chart/subscrib-visible-logical-range';
import { ErrorBoundary } from '../commons/error-boundary';

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
	data: OlcvResponseDTO;
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

const SubscribeCandlestick = ({
	enable = true,
	onLoad,
}: {
	enable?: boolean;
	onLoad?: (data: OlcvResponseDTO) => void;
}) => {
	const { mutate, isPending, isError } = useMutationOhlcv();
	const { meta, query } = useCandlestick();
	const [timeFrom, setTimeFrom] = useState(query.time_from);
	const series = useSeries('SubscribeCandlestick');
	const [isNoData, setIsNoData] = useState(false);
	const queryClient = useQueryClient();

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
					return dayjs.unix(current).unix();
			}
		},
		[],
	);

	const handleSubscribe = useCallback(
		(data: OlcvResponseDTO) => {
			const previousData = queryClient.getQueryData<OlcvResponseDTO>(['birdeye', 'ohlcv', meta.address, query.type]);

			if (Array.isArray(previousData) && data.length > 0) {
				queryClient.setQueryData<OlcvResponseDTO>(['birdeye', 'ohlcv', meta.address, query.type], prev => {
					if (!prev) {
						return [];
					}

					const _data = [...data, ...prev];

					series.api().setData(
						_data.map(item => ({
							...item,
							time: item.unix as Time,
						})),
					);

					onLoad?.(_data);

					return _data;
				});
			}
		},
		[meta.address, onLoad, query.type, queryClient, series],
	);

	const handleSubscribeVisibleLogicalRange = useCallback(
		(range: number) => {
			if (isPending || isNoData || isError) {
				return;
			}
			const numberBarsToLoad = 50 - range;
			const newTimeFrom = handleGenerateTimeWithInterval(timeFrom, query.type, numberBarsToLoad);
			const newTimeTo = handleGenerateTimeWithInterval(timeFrom, query.type, 0);
			setTimeFrom(newTimeFrom);
			mutate(
				{
					data: {
						address: meta.address,
						type: query.type,
						time_from: newTimeFrom,
						time_to: newTimeTo,
					},
				},
				{
					onSuccess: _data => {
						const data = _data.map(item => ({
							...item,
							time: item.unix as Time,
						}));

						if (data.length === 0) {
							setIsNoData(true);
						} else {
							setIsNoData(false);
							handleSubscribe(data);
						}
					},
					onError: error => {
						console.error(error);
						toast.error('Failed to load data');
					},
				},
			);
		},
		[
			isPending,
			isNoData,
			isError,
			handleGenerateTimeWithInterval,
			timeFrom,
			query.type,
			mutate,
			meta.address,
			handleSubscribe,
		],
	);

	if (!enable) {
		return null;
	}

	return (
		<SubscribeVisibleLogicalRange
			enabled={!isPending && !isNoData && !isError}
			method={handleSubscribeVisibleLogicalRange}
		/>
	);
};

const NoDataWatermark = ({ data, text = 'No data' }: { data: OlcvResponseDTO; text?: string }) => {
	const chart = useChart();

	useEffect(() => {
		if (data.length === 0) {
			const firstPane = chart.api().panes()[0];
			createTextWatermark(firstPane, {
				horzAlign: 'center',
				vertAlign: 'center',
				lines: [
					{
						text,
						color: twTheme.extend.colors.description.DEFAULT,
						fontSize: 24,
					},
				],
			});
		}
	}, [data, chart, text]);
	return null;
};

const Chart = () => {
	const tUtils = useTranslations('utils');
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
	const histogramSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

	const { data, isPending, query } = useCandlestick();

	const initData = useMemo(() => {
		return data.map(item => ({
			...item,
			value: item.volume,
			time: item.unix as Time,
			color: item.close > item.open ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.sell.disabled,
		}));
	}, [data]);

	const handleSubscribeHistogram = useCallback((data: OlcvResponseDTO) => {
		if (histogramSeriesRef.current) {
			histogramSeriesRef.current.setData(
				data.map(item => ({
					value: item.volume,
					time: item.unix as Time,
					color: item.close > item.open ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.sell.disabled,
				})),
			);
		}
	}, []);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[55dvh]">
				<Spinner />
			</div>
		);
	}

	return (
		<TradingChart
			key={query.type}
			className="h-[55dvh]"
			initOptions={initOptions}
			onInit={c => {
				if (data.length < 50) {
					c.timeScale().fitContent();
				}
			}}
		>
			<NoDataWatermark data={data} text={tUtils('no-data')} />
			<Series
				series={CandlestickSeries}
				data={initData.map(item => ({
					...item,
					color: undefined,
				}))}
				options={{
					upColor: searchParams.mark ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.buy.DEFAULT,
					downColor: searchParams.mark ? twTheme.extend.colors.sell.disabled : twTheme.extend.colors.sell.DEFAULT,
					borderVisible: false,
					wickUpColor: searchParams.mark ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.buy.DEFAULT,
					wickDownColor: searchParams.mark ? twTheme.extend.colors.sell.disabled : twTheme.extend.colors.sell.DEFAULT,
				}}
			>
				<SubscribeCandlestick onLoad={handleSubscribeHistogram} />
			</Series>
			<Series
				ref={histogramSeriesRef}
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
				<ErrorBoundary>
					<MarkerTooltipProvider>
						<Chart />
						<MarkerTooltip />
					</MarkerTooltipProvider>
				</ErrorBoundary>
			</section>
		</CandlestickProvider>
	);
};

export default Candlestick;
