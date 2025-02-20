'use client';

import React, { useEffect, useRef } from 'react';

import type { IChartApi, ChartOptions, DeepPartial } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';

interface Props {
	height?: number;
	initOptions?: DeepPartial<ChartOptions>;
	onInit?: (chart: IChartApi) => void;
}

const TradingChart = (props: Props) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef.current?.clientWidth ?? 0 });
		};

		if (!chartContainerRef.current) {
			return;
		}

		const chart = createChart(chartContainerRef.current, {
			...props.initOptions,
			width: chartContainerRef.current?.clientWidth ?? 0,
			height: 300,
		});
		chart.timeScale().fitContent();

		if (props.onInit) {
			props.onInit(chart);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [props]);

	return <div ref={chartContainerRef} />;
};

export default TradingChart;
