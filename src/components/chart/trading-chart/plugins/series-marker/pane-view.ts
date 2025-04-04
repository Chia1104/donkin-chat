import type {
	IChartApiBase,
	Coordinate,
	AreaData,
	BarData,
	BaselineData,
	CandlestickData,
	HistogramData,
	LineData,
	SeriesDataItemTypeMap,
	SingleValueData,
	IPrimitivePaneView,
	SeriesType,
	Logical,
	TimePointIndex,
	ISeriesApi,
} from 'lightweight-charts';

import { ensureNotNull } from '@/utils/assertions';
import { isNumber } from '@/utils/is';

import { RangeImpl } from './range-impl';
import type { SeriesMarkerRendererData, SeriesMarkerRendererDataItem } from './renderer';
import { SeriesMarkersRenderer } from './renderer';
import { visibleTimedValues } from './time-data';
import type { InternalSeriesMarker } from './types';
import { calculateShapeHeight, shapeMargin as calculateShapeMargin } from './utils';

const enum Constants {
	TextMargin = 0.1,
}

export type UpdateType = 'data' | 'other' | 'options';

interface Offsets {
	aboveBar: number;
	belowBar: number;
}

function fillSizeAndY<HorzScaleItem>(
	rendererItem: SeriesMarkerRendererDataItem,
	marker: InternalSeriesMarker<TimePointIndex>,
	seriesData: SeriesDataItemTypeMap<HorzScaleItem>[SeriesType],
	offsets: Offsets,
	textHeight: number,
	shapeMargin: number,
	series: ISeriesApi<SeriesType, HorzScaleItem>,
	chart: IChartApiBase<HorzScaleItem>,
): void {
	const timeScale = chart.timeScale();
	let inBarPrice: number;
	let highPrice: number;
	let lowPrice: number;

	if (isValueData(seriesData)) {
		inBarPrice = seriesData.value;
		highPrice = seriesData.value;
		lowPrice = seriesData.value;
	} else if (isOhlcData(seriesData)) {
		inBarPrice = seriesData.close;
		highPrice = seriesData.high;
		lowPrice = seriesData.low;
	} else {
		return;
	}

	const sizeMultiplier = isNumber(marker.size) ? Math.max(marker.size, 0) : 1;
	const shapeSize = calculateShapeHeight(timeScale.options().barSpacing) * sizeMultiplier;
	const halfSize = shapeSize / 2;
	rendererItem.size = shapeSize;
	switch (marker.position) {
		case 'inBar': {
			rendererItem.y = ensureNotNull(series.priceToCoordinate(inBarPrice));
			if (rendererItem.text !== undefined) {
				rendererItem.text.y = (rendererItem.y +
					halfSize +
					shapeMargin +
					textHeight * (0.5 + Constants.TextMargin)) as Coordinate;
			}
			return;
		}
		case 'aboveBar': {
			rendererItem.y = (ensureNotNull(series.priceToCoordinate(highPrice)) - halfSize - offsets.aboveBar) as Coordinate;
			if (rendererItem.text !== undefined) {
				rendererItem.text.y = (rendererItem.y - halfSize - textHeight * (0.5 + Constants.TextMargin)) as Coordinate;
				offsets.aboveBar += textHeight * (1 + 2 * Constants.TextMargin);
			}
			offsets.aboveBar += shapeSize + shapeMargin;
			return;
		}
		case 'belowBar': {
			rendererItem.y = (ensureNotNull(series.priceToCoordinate(lowPrice)) + halfSize + offsets.belowBar) as Coordinate;
			if (rendererItem.text !== undefined) {
				rendererItem.text.y = (rendererItem.y +
					halfSize +
					shapeMargin +
					textHeight * (0.5 + Constants.TextMargin)) as Coordinate;
				offsets.belowBar += textHeight * (1 + 2 * Constants.TextMargin);
			}
			offsets.belowBar += shapeSize + shapeMargin;
			return;
		}
	}
}

function isValueData<HorzScaleItem>(
	data: SeriesDataItemTypeMap<HorzScaleItem>[SeriesType],
): data is
	| LineData<HorzScaleItem>
	| HistogramData<HorzScaleItem>
	| AreaData<HorzScaleItem>
	| BaselineData<HorzScaleItem> {
	return 'value' in data && typeof (data as unknown as SingleValueData).value === 'number';
}

function isOhlcData<HorzScaleItem>(
	data: SeriesDataItemTypeMap<HorzScaleItem>[SeriesType],
): data is BarData<HorzScaleItem> | CandlestickData<HorzScaleItem> {
	return 'open' in data && 'high' in data && 'low' in data && 'close' in data;
}

export class SeriesMarkersPaneView<HorzScaleItem> implements IPrimitivePaneView {
	private readonly _series: ISeriesApi<SeriesType, HorzScaleItem>;
	private readonly _chart: IChartApiBase<HorzScaleItem>;
	private _data: SeriesMarkerRendererData;
	private _markers: InternalSeriesMarker<TimePointIndex>[] = [];

	private _invalidated = true;
	private _dataInvalidated = true;

	private _renderer: SeriesMarkersRenderer = new SeriesMarkersRenderer();

	public constructor(series: ISeriesApi<SeriesType, HorzScaleItem>, chart: IChartApiBase<HorzScaleItem>) {
		this._series = series;
		this._chart = chart;
		this._data = {
			items: [],
			visibleRange: null,
		};
	}

	public renderer(): SeriesMarkersRenderer | null {
		if (!this._series.options().visible) {
			return null;
		}

		if (this._invalidated) {
			this._makeValid();
		}

		const layout = this._chart.options().layout;
		this._renderer.setParams(layout.fontSize, layout.fontFamily);
		this._renderer.setData(this._data);

		return this._renderer;
	}

	public setMarkers(markers: InternalSeriesMarker<TimePointIndex>[]): void {
		this._markers = markers;
		this.update('data');
	}

	public update(updateType?: UpdateType): void {
		this._invalidated = true;
		if (updateType === 'data') {
			this._dataInvalidated = true;
		}
	}

	protected _makeValid(): void {
		const timeScale = this._chart.timeScale();
		const seriesMarkers = this._markers;
		if (this._dataInvalidated) {
			this._data.items = seriesMarkers.map<SeriesMarkerRendererDataItem>(
				(marker: InternalSeriesMarker<TimePointIndex>) => ({
					time: marker.time,
					x: 0 as Coordinate,
					y: 0 as Coordinate,
					size: 0,
					color: marker.color,
					externalId: marker.id,
					internalId: marker.internalId,
					text: undefined,
					src: marker.src,
				}),
			);
			this._dataInvalidated = false;
		}

		const layoutOptions = this._chart.options().layout;

		this._data.visibleRange = null;
		const visibleBars = timeScale.getVisibleLogicalRange();

		if (visibleBars === null) {
			return;
		}
		const visibleBarsRange = new RangeImpl(
			Math.floor(visibleBars.from) as TimePointIndex,
			Math.ceil(visibleBars.to) as TimePointIndex,
		);
		const firstValue = this._series.data()[0];
		if (firstValue === null) {
			return;
		}
		if (this._data.items.length === 0) {
			return;
		}
		let prevTimeIndex = NaN;
		const shapeMargin = calculateShapeMargin(timeScale.options().barSpacing);
		const offsets: Offsets = {
			aboveBar: shapeMargin,
			belowBar: shapeMargin,
		};

		this._data.visibleRange = visibleTimedValues(this._data.items, visibleBarsRange, true);
		for (let index = this._data.visibleRange.from; index < this._data.visibleRange.to; index++) {
			const marker = seriesMarkers[index];
			if (marker.time !== prevTimeIndex) {
				// new bar, reset stack counter
				offsets.aboveBar = shapeMargin;
				offsets.belowBar = shapeMargin;
				prevTimeIndex = marker.time;
			}

			const rendererItem = this._data.items[index];
			rendererItem.x = ensureNotNull(timeScale.logicalToCoordinate(marker.time as unknown as Logical));
			if (marker.text !== undefined && marker.text.length > 0) {
				rendererItem.text = {
					content: marker.text,
					x: 0 as Coordinate,
					y: 0 as Coordinate,
					width: 0,
					height: 0,
				};
			}

			const dataAt = ensureNotNull(this._series.dataByIndex(marker.time, -1));
			if (dataAt === null) {
				continue;
			}
			fillSizeAndY<HorzScaleItem>(
				rendererItem,
				marker,
				dataAt,
				offsets,
				layoutOptions.fontSize,
				shapeMargin,
				this._series,
				this._chart,
			);
		}

		this._invalidated = false;
	}
}
