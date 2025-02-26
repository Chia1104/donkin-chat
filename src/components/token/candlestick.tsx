'use client';

import { memo } from 'react';

import { Chip } from '@heroui/chip';
import { Tabs, Tab } from '@heroui/tabs';
import { CandlestickSeries, ColorType } from 'lightweight-charts';
import { useLocale } from 'next-intl';

import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import dayjs from '@/utils/dayjs';

import { createSeriesMarkers } from '../chart/plugins/series-marker';
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
			color="primary"
			classNames={{
				tabList: 'gap-1',
				tab: 'py-1 px-2',
				cursor: 'bg-transparent border-1 border-primary/25 text-primary',
				tabContent: 'group-data-[selected=true]:text-primary',
			}}
			selectedKey={searchParams.interval}
			onSelectionChange={key => {
				void setSearchParams({
					interval: key as IntervalFilter,
				});
			}}
		>
			<Tab key={IntervalFilter.SixHours} title={IntervalFilter.SixHours} />
			<Tab key={IntervalFilter.TwelveHours} title={IntervalFilter.TwelveHours} />
			<Tab key={IntervalFilter.OneDay} title={IntervalFilter.OneDay} />
			<Tab key={IntervalFilter.ThreeDays} title={IntervalFilter.ThreeDays} />
			<Tab key={IntervalFilter.SevenDays} title={IntervalFilter.SevenDays} />
			<Tab key={IntervalFilter.ThirtyDays} title={IntervalFilter.ThirtyDays} />
		</Tabs>
	);
});

const MetaInfo = () => {
	return (
		<div className="flex items-center gap-2">
			<h3 className="text-xl font-normal">$0.3168105</h3>
			<Chip color="danger" variant="flat" radius="sm" size="sm">
				-0.87%
			</Chip>
		</div>
	);
};

const Chart = () => {
	const locale = useLocale();
	const [searchParams] = useTokenSearchParams();
	return (
		<TradingChart
			height={350}
			onInit={chart => {
				const series = chart.addSeries(CandlestickSeries, {
					upColor: searchParams.mark ? '#2A4B3E' : '#45926D',
					downColor: searchParams.mark ? '#542029' : '#AE3241',
					borderVisible: false,
					wickUpColor: searchParams.mark ? '#2A4B3E' : '#45926D',
					wickDownColor: searchParams.mark ? '#542029' : '#AE3241',
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
				createSeriesMarkers(series, [
					{
						time: dayjs().format('YYYY-MM-DD'),
						position: 'belowBar',
						color: searchParams.mark ? '#542029' : '#AE3241',
						src: 'https://avatars.githubusercontent.com/u/38397958?v=4',
						size: 1,
					},
					{
						time: dayjs().format('YYYY-MM-DD'),
						position: 'belowBar',
						color: searchParams.mark ? '#542029' : '#AE3241',
						src: 'https://avatars.githubusercontent.com/u/38397958?v=4',
						size: 1,
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
		<section className="border-1 border-divider p-5 w-full h-[490px] rounded-lg flex flex-col gap-10">
			<header className="flex items-center justify-between">
				<MetaInfo />
				<DateFilter />
			</header>
			<Chart />
		</section>
	);
};

export default Candlestick;
