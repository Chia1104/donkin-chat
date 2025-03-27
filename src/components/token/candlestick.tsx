'use client';

import { memo, createContext, use, useMemo, useRef, useState, useCallback } from 'react';
import type { PropsWithChildren } from 'react';

import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { CandlestickSeries, ColorType, HistogramSeries } from 'lightweight-charts';
import type { Time, IChartApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';

import { experimental_useTailwindTheme as useTailwindTheme } from '@/hooks/useTailwindTheme';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isPositiveNumber, isNegativeNumber, isNumber } from '@/utils/is';

// import { createClickableMarkers } from '../chart/plugins/clickable-marker/core';
import {
	MarkerTooltipProvider,
	MarkerTooltip,
	// useMarkerTooltipStore,
} from '../chart/plugins/clickable-marker/marker-tooltip';
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
	// const { openTooltip, closeTooltip } = useMarkerTooltipStore(store => store);
	const twTheme = useTailwindTheme();
	const { data: _data, isPending } = useCandlestick();
	const data = useMemo(() => {
		return _data.map(item => ({
			...item,
			value: item.volume,
			time: item.unix as Time,
			color: item.close > item.open ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.sell.disabled,
		}));
	}, [_data, twTheme.theme.colors.buy.disabled, twTheme.theme.colors.sell.disabled]);

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
				data.map(item => ({
					...item,
					color: undefined,
				})),
			);
			volumeSeries.setData(data);
		},
		[
			data,
			searchParams.mark,
			twTheme.theme.colors.buy.DEFAULT,
			twTheme.theme.colors.buy.disabled,
			twTheme.theme.colors.sell.DEFAULT,
			twTheme.theme.colors.sell.disabled,
		],
	);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[485px]">
				<Spinner />
			</div>
		);
	}

	return <TradingChart ref={chartRef} height={485} onInit={handleInit} initOptions={initOptions} />;
};

const Candlestick = (props: CandlestickProps) => {
	return (
		<CandlestickProvider {...props}>
			<section className="w-full h-[625px] rounded-lg flex flex-col gap-10">
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
