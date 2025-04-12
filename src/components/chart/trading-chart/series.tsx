'use client';

import type { ForwardedRef } from 'react';
import { useLayoutEffect, useRef, forwardRef, useImperativeHandle, createContext, use } from 'react';

import type {
	Time,
	SeriesPartialOptionsMap,
	SeriesType,
	SeriesDefinition,
	ISeriesApi,
	IChartApi,
	SeriesDataItemTypeMap,
} from 'lightweight-charts';
import { CandlestickSeries as _CandlestickSeries } from 'lightweight-charts';

import { useChart } from './chart';

export interface SeriesContext<T extends SeriesType> {
	_api: ISeriesApi<T> | null;
	api: () => ISeriesApi<T>;
	free: (chart?: IChartApi) => void;
	isDisposed: () => boolean;
}

interface Props<T extends SeriesType> {
	data: SeriesDataItemTypeMap<Time>[T][];
	series: SeriesDefinition<T>;
	options?: SeriesPartialOptionsMap[T];
	onInit?: (series: ISeriesApi<T>, chart: IChartApi | null) => void;
	children?: React.ReactNode;
}

const SeriesContext = createContext<SeriesContext<SeriesType> | null>(null);

const SeriesWithGeneric = <T extends SeriesType>(
	{ data, series: _series, options, onInit, children }: Props<T>,
	ref: ForwardedRef<ISeriesApi<T>>,
) => {
	useImperativeHandle(ref, () => series.current.api(), []);
	const chart = useChart('Series');
	const series = useRef<SeriesContext<T>>({
		_api: null,
		api() {
			if (!this._api) {
				this._api = chart.api().addSeries(_series, options);
				this._api.setData(data);
				onInit?.(this._api, chart._api);
			}
			return this._api;
		},
		free() {
			// check if parent component was removed already
			if (this._api) {
				// remove only current series
				chart.free(this._api);
				this._api = null;
			}
		},
		isDisposed() {
			return this._api === null;
		},
	});

	useLayoutEffect(() => {
		const currentRef = series.current;
		currentRef.api();

		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		const currentRef = series.current;
		if (options) {
			currentRef.api().applyOptions(options);
		}
	}, [options]);

	return <SeriesContext value={series.current}>{children}</SeriesContext>;
};

export const useSeries = (name = 'useSeries') => {
	const context = use(SeriesContext);
	if (!context) {
		throw new Error(`${name} must be used within a Series`);
	}
	return context;
};

export const Series = forwardRef(SeriesWithGeneric) as <T extends SeriesType>(
	props: Props<T> & { ref?: ForwardedRef<ISeriesApi<T>> },
) => ReturnType<typeof SeriesWithGeneric>;
