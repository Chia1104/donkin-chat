'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

import type { IChartApi, ChartOptions, DeepPartial } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';

interface TradingChartProps extends ComponentPropsWithoutRef<'div'> {
	height?: number;
	initOptions?: DeepPartial<ChartOptions>;
	onInit?: (chart: IChartApi, container: HTMLDivElement) => void;
}

export interface TradingChartRef {
	chart: IChartApi | null;
}

const TradingChart = forwardRef<TradingChartRef, TradingChartProps>(
	({ height, initOptions, onInit, ...props }, ref) => {
		useImperativeHandle(ref, () => ({
			chart,
		}));

		const chartContainerRef = useRef<HTMLDivElement | null>(null);
		const [chart, setChart] = useState<IChartApi | null>(null);

		useEffect(() => {
			const handleResize = () => {
				chartInstance.applyOptions({ width: chartContainerRef.current?.clientWidth ?? 0 });
			};

			if (!chartContainerRef.current) {
				return;
			}

			const chartInstance = createChart(chartContainerRef.current, {
				...initOptions,
				width: chartContainerRef.current?.clientWidth ?? 0,
				height,
			});
			chartInstance.timeScale().fitContent();

			setChart(chartInstance);

			if (onInit) {
				onInit(chartInstance, chartContainerRef.current);
			}

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chartInstance.remove();
			};
		}, [height, initOptions, onInit]);

		return <div ref={chartContainerRef} {...props} />;
	},
);

export default TradingChart;
