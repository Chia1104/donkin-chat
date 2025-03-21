'use client';

import React, { useEffect, useRef, useState } from 'react';

import { createChart, CandlestickSeries } from 'lightweight-charts';
import type { CandlestickData, DeepPartial, ChartOptions, Time, IChartApi, ISeriesApi } from 'lightweight-charts';

interface Props {
	height?: number;
	width?: number;
	data: CandlestickData<Time>[];
	initOptions?: DeepPartial<ChartOptions>;
	seriesOptions?: DeepPartial<Record<string, unknown>>;
	onInit?: (chart: IChartApi, series: ISeriesApi<'Candlestick'>, container: HTMLDivElement) => void;
	className?: string;
}

const CandlestickChart = (props: Props) => {
	const { data, height = 400, className = '', initOptions, seriesOptions, onInit } = props;
	const chartContainerRef = useRef<HTMLDivElement | null>(null);
	const [chart, setChart] = useState<IChartApi | null>(null);
	const [series, setSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);

	useEffect(() => {
		const handleResize = () => {
			if (chart) {
				chart.applyOptions({
					width: chartContainerRef.current?.clientWidth ?? 0,
				});
			}
		};

		if (!chartContainerRef.current) return;

		// 初始化圖表
		const chartInstance = createChart(chartContainerRef.current, {
			layout: {
				background: { color: 'rgba(33, 35, 37, 0.45)' },
				textColor: 'rgba(255, 255, 255, 0.45)',
			},
			grid: {
				vertLines: { color: 'rgba(41, 45, 48, 0.5)' },
				horzLines: { color: 'rgba(41, 45, 48, 0.5)' },
			},
			timeScale: {
				borderColor: 'rgba(255, 255, 255, 0.15)',
			},
			width: chartContainerRef.current?.clientWidth ?? 0,
			height,
			...initOptions,
		});

		// 添加 K 線圖系列
		const candlestickSeries = chartInstance.addSeries(CandlestickSeries, {
			upColor: '#38AF75', // 漲的蠟燭顏色 (綠色)
			downColor: '#E75A5B', // 跌的蠟燭顏色 (紅色)
			borderUpColor: '#38AF75',
			borderDownColor: '#E75A5B',
			wickUpColor: '#38AF75',
			wickDownColor: '#E75A5B',
			...seriesOptions,
		});

		// 設置數據
		candlestickSeries.setData(data);

		// 讓圖表適應內容
		chartInstance.timeScale().fitContent();

		// 保存引用以便在其他地方使用
		setChart(chartInstance);
		setSeries(candlestickSeries);

		// 如果有 onInit 回調，執行它
		if (onInit) {
			onInit(chartInstance, candlestickSeries, chartContainerRef.current);
		}

		// 添加調整大小事件監聽器
		window.addEventListener('resize', handleResize);

		// 清理函數
		return () => {
			window.removeEventListener('resize', handleResize);
			if (chartInstance) {
				chartInstance.remove();
			}
		};
	}, []);

	// 當數據更新時更新圖表
	useEffect(() => {
		if (series && data.length > 0) {
			series.setData(data);
		}
	}, [data, series]);

	return (
		<div className={className}>
			<div ref={chartContainerRef} />
		</div>
	);
};

export default CandlestickChart;
