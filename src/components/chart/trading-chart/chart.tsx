'use client';

import {
	createContext,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
	use,
} from 'react';

import type { IChartApi, ISeriesApi, SeriesType, ChartOptions, DeepPartial } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';

export interface ChartContext {
	_api: IChartApi | null;
	api: () => IChartApi;
	free: (series: ISeriesApi<SeriesType>) => void;
}

interface ChartContainerProps {
	children: React.ReactNode;
	container: HTMLDivElement;
	layout?: DeepPartial<ChartOptions['layout']>;
	initOptions?: DeepPartial<ChartOptions>;
	onInit?: (chart: IChartApi) => void;
}

interface ChartProps
	extends Omit<ChartContainerProps, 'container'>,
		Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {}

export const ChartContext = createContext<ChartContext | null>(null);

export const useChart = (name = 'useChart') => {
	const context = use(ChartContext);
	if (!context) {
		throw new Error(`${name} must be used within a Chart`);
	}
	return context;
};

export const Chart = forwardRef<IChartApi, ChartProps>(({ children, layout, initOptions, onInit, ...props }, ref) => {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const handleRef = useCallback((ref: HTMLDivElement) => setContainer(ref), []);
	return (
		<div ref={handleRef} {...props}>
			{container && (
				<ChartContainer ref={ref} container={container} layout={layout} onInit={onInit} initOptions={initOptions}>
					{children}
				</ChartContainer>
			)}
		</div>
	);
});

export const ChartContainer = forwardRef<IChartApi, ChartContainerProps>(
	({ children, container, layout, initOptions, onInit }, ref) => {
		const chartApiRef = useRef<ChartContext>({
			_api: null,
			api() {
				if (!this._api) {
					this._api = createChart(container, {
						...initOptions,
						layout,
						width: container.clientWidth,
					});
					onInit?.(this._api);
				}
				return this._api;
			},
			free(series) {
				if (this._api && series) {
					this._api.removeSeries(series);
				}
			},
		});

		useLayoutEffect(() => {
			const currentRef = chartApiRef.current;
			const chart = currentRef.api();

			const handleResize = () => {
				chart.applyOptions({
					width: container.clientWidth,
				});
			};

			window.addEventListener('resize', handleResize);
			return () => {
				window.removeEventListener('resize', handleResize);
				chartApiRef.current._api = null;
				chart.remove();
			};
		}, [container]);

		useLayoutEffect(() => {
			const currentRef = chartApiRef.current;
			currentRef.api();
		}, []);

		useLayoutEffect(() => {
			const currentRef = chartApiRef.current;
			if (initOptions) {
				currentRef.api().applyOptions(initOptions);
			}
		}, [initOptions]);

		useImperativeHandle(ref, () => chartApiRef.current.api(), []);

		useEffect(() => {
			const currentRef = chartApiRef.current;
			if (layout) {
				currentRef.api().applyOptions({ layout });
			}
		}, [layout]);

		return <ChartContext value={chartApiRef.current}>{children}</ChartContext>;
	},
);
