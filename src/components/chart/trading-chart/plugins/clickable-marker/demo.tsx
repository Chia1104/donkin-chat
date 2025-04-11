'use client';

import { useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import type { Time } from 'lightweight-charts';
import { CandlestickSeries, createChart } from 'lightweight-charts';

import { logger } from '@/utils/logger';

import type { ClickableMarker } from './core';
import { createClickableMarkers } from './core';
import { MarkerTooltipProvider, MarkerTooltip, useMarkerTooltipStore } from './marker-tooltip';

// 模擬數據
const mockData = [
	{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: dayjs().subtract(6, 'day').format('YYYY-MM-DD') },
	{ open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: dayjs().subtract(5, 'day').format('YYYY-MM-DD') },
	{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: dayjs().subtract(4, 'day').format('YYYY-MM-DD') },
	{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: dayjs().subtract(3, 'day').format('YYYY-MM-DD') },
	{ open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: dayjs().subtract(2, 'day').format('YYYY-MM-DD') },
	{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
	{ open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: dayjs().format('YYYY-MM-DD') },
];

// 模擬標記
const mockMarkers: ClickableMarker<Time>[] = [
	{
		time: dayjs().subtract(5, 'day').format('YYYY-MM-DD') as Time,
		position: 'belowBar',
		color: '#E75A5B',
		size: 1,
		src: 'https://avatars.githubusercontent.com/u/38397958?v=4',
		tooltip: (
			<div className="bg-white w-[300px] h-[300px]">
				<p>test</p>
			</div>
		),
		type: 'avatar',
	},
	{
		time: dayjs().subtract(2, 'day').format('YYYY-MM-DD') as Time,
		position: 'aboveBar',
		color: '#38AF75',
		size: 1,
		src: 'https://avatars.githubusercontent.com/u/38397958?v=4',
		tooltip: 'test',
		type: 'avatar',
	},
];

const Chart = () => {
	const chartRef = useRef<HTMLDivElement>(null);
	const { openTooltip, closeTooltip } = useMarkerTooltipStore(store => store);

	useEffect(() => {
		if (!chartRef.current) return;

		// 創建圖表
		const chart = createChart(chartRef.current, {
			height: 400,
			layout: {
				background: { color: 'rgba(33, 35, 37, 0.45)' },
				textColor: 'rgba(255, 255, 255, 0.9)',
			},
			grid: {
				vertLines: { color: 'rgba(41, 45, 48, 0.5)' },
				horzLines: { color: 'rgba(41, 45, 48, 0.5)' },
			},
			timeScale: {
				borderColor: 'rgba(255, 255, 255, 0.15)',
			},
		});

		// 添加 K 線圖系列
		const series = chart.addSeries(CandlestickSeries, {
			upColor: '#38AF75',
			downColor: '#E75A5B',
			borderVisible: false,
			wickUpColor: '#38AF75',
			wickDownColor: '#E75A5B',
		});

		// 設置數據
		series.setData(mockData);
		chart.timeScale().fitContent();

		// 創建可點擊標記
		createClickableMarkers<Time>(chart, series, mockMarkers, {
			onClick: marker => {
				logger(['標記被點擊:', marker], { type: 'log' });
			},
			onOpenTooltip: openTooltip,
			onCloseTooltip: closeTooltip,
		});

		return () => {
			chart.remove();
		};
	}, [closeTooltip, openTooltip]);

	return <div ref={chartRef} className="w-full h-[400px]" />;
};

const ClickableMarkerDemo = () => {
	return (
		<MarkerTooltipProvider>
			<div className="w-full rounded-lg overflow-hidden">
				<h2 className="text-xl font-bold mb-4">可點擊標記示例</h2>
				<p className="text-gray-400 mb-4">點擊圖表中的標記查看更多信息</p>
				<Chart />
				<MarkerTooltip />
				<div className="mt-4 text-sm text-gray-400">
					<p>1. 紅色：賣出信號</p>
					<p>2. 綠色：買入信號</p>
				</div>
			</div>
		</MarkerTooltipProvider>
	);
};

export default ClickableMarkerDemo;
