'use client';

import { memo } from 'react';

import { Chip } from '@heroui/chip';
import { Tabs, Tab } from '@heroui/tabs';
import { CandlestickSeries, ColorType, HistogramSeries } from 'lightweight-charts';
import { useLocale } from 'next-intl';

import { experimental_useTailwindTheme as useTailwindTheme } from '@/hooks/useTailwindTheme';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import dayjs from '@/utils/dayjs';

import { createClickableMarkers } from '../chart/plugins/clickable-marker/core';
import {
	MarkerTooltipProvider,
	MarkerTooltip,
	useMarkerTooltipStore,
} from '../chart/plugins/clickable-marker/marker-tooltip';
import TradingChart from '../chart/trading-chart';

const _MOCK_DATA = [
	{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: dayjs().format('YYYY-MM-DD') },
	{ open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: dayjs().add(1, 'day').format('YYYY-MM-DD') },
	{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: dayjs().add(2, 'day').format('YYYY-MM-DD') },
	{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: dayjs().add(3, 'day').format('YYYY-MM-DD') },
	{ open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: dayjs().add(4, 'day').format('YYYY-MM-DD') },
	{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: dayjs().add(5, 'day').format('YYYY-MM-DD') },
	{ open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: dayjs().add(6, 'day').format('YYYY-MM-DD') },
];

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
	return (
		<div className="flex items-center gap-2">
			<h3 className="text-[22px] font-medium">$0.3168105</h3>
			<Chip color="danger" variant="flat" radius="sm" size="sm">
				-0.87%
			</Chip>
		</div>
	);
};

const Chart = () => {
	const locale = useLocale();
	const [searchParams] = useTokenSearchParams();
	const { openTooltip, closeTooltip } = useMarkerTooltipStore(store => store);
	const twTheme = useTailwindTheme();
	return (
		<TradingChart
			height={485}
			onInit={chart => {
				const series = chart.addSeries(CandlestickSeries, {
					upColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
					downColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
					borderVisible: false,
					wickUpColor: searchParams.mark ? twTheme.theme.colors.buy.disabled : twTheme.theme.colors.buy.DEFAULT,
					wickDownColor: searchParams.mark ? twTheme.theme.colors.sell.disabled : twTheme.theme.colors.sell.DEFAULT,
				});

				// mock data
				series.setData([
					{
						open: 10,
						high: 10.63,
						low: 9.49,
						close: 9.55,
						time: dayjs().format('YYYY-MM-DD'),
					},
					{ open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: dayjs().add(1, 'day').format('YYYY-MM-DD') },
					{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: dayjs().add(2, 'day').format('YYYY-MM-DD') },
					{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: dayjs().add(3, 'day').format('YYYY-MM-DD') },
					{ open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: dayjs().add(4, 'day').format('YYYY-MM-DD') },
					{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: dayjs().add(5, 'day').format('YYYY-MM-DD') },
					{ open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: dayjs().add(6, 'day').format('YYYY-MM-DD') },
				]);
				chart.timeScale().fitContent();
				if (searchParams.mark) {
					createClickableMarkers(
						chart,
						series,
						[
							{
								time: dayjs().format('YYYY-MM-DD'),
								position: 'aboveBar',
								color: '#FFFFFF73',
								src: '/assets/images/buy-icon.svg',
								size: 1,
								tooltip: 'test 1',
							},
							{
								time: dayjs().format('YYYY-MM-DD'),
								position: 'aboveBar',
								color: '#FFFFFF73',
								src: '/assets/images/sell-icon.svg',
								size: 1,
								text: '+35',
								tooltip: 'test 2',
							},
						],
						{
							onClick: marker => {
								console.log('標記被點擊:', marker);
							},
							onOpenTooltip: openTooltip,
							onCloseTooltip: closeTooltip,
						},
					);
				}

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
				volumeSeries.setData([
					{
						time: dayjs().format('YYYY-MM-DD'),
						value: 8,
						color: twTheme.theme.colors.sell.disabled,
					},
					{
						time: dayjs().add(1, 'day').format('YYYY-MM-DD'),
						value: 7,
						color: twTheme.theme.colors.buy.disabled,
					},
				]);
			}}
			initOptions={{
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
			}}
		/>
	);
};

const Candlestick = () => {
	return (
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
	);
};

export default Candlestick;
