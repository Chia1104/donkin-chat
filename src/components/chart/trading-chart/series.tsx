'use client';

import { useLayoutEffect, useRef } from 'react';

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

import type { SeriesContext } from './chart';
import { useChart } from './chart';

interface Props<T extends SeriesType> {
	data: SeriesDataItemTypeMap<Time>[T][];
	series: SeriesDefinition<T>;
	options?: SeriesPartialOptionsMap[T];
	onInit?: (series: ISeriesApi<T>, chart: IChartApi | null) => void;
}

export const Series = <T extends SeriesType>({ data, series: _series, options, onInit }: Props<T>) => {
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

	return null;
};
