import type { IChartApi, ISeriesApi, MouseEventHandler, MouseEventParams, SeriesType, Time } from 'lightweight-charts';

import { createSeriesMarkers } from '../series-marker';
import type { SeriesMarker } from '../series-marker/types';

export interface ClickableMarkerOptions {
	onClick?: (marker: ClickableMarker<Time>, event: MouseEvent) => void;
	onOpenTooltip?: (option: {
		tooltip: React.ReactNode;
		visible: true;
		position: { x: number; y: number };
		container: HTMLElement;
		activeMarker: ClickableMarker<Time>;
	}) => void;
	onCloseTooltip?: (option: { visible: false }) => void;
}

export interface ClickableMarker<TimeType> extends Omit<SeriesMarker<TimeType>, 'tooltip'> {
	tooltip?: React.ReactNode;
}

export interface ClickableMarkerPluginApi<TimeType> {
	setMarkers: (markers: ClickableMarker<TimeType>[]) => void;
	markers: () => readonly ClickableMarker<TimeType>[];
	/**
	 * WARNING: It may cause error with `seriesMarkers.detach()` - `Error: Object is disposed`
	 * If you want to remove the markers, check the series is disposed or not before calling this method.
	 *
	 * @example
	 * ```ts
	 * const { detach } = createClickableMarkers(chart, series, markers);
	 *
	 * if (!series.isDisposed()) {
	 * 	detach();
	 * }
	 * ```
	 */
	detach: () => void;
}

/**
 * 創建可點擊的標記插件
 */
export function createClickableMarkers<TimeType>(
	chart: IChartApi,
	series: ISeriesApi<SeriesType, TimeType>,
	markers?: ClickableMarker<TimeType>[],
	options?: ClickableMarkerOptions,
): ClickableMarkerPluginApi<TimeType> {
	// 創建基本的標記插件
	// 使用 type casting 處理類型兼容性問題
	const seriesMarkers = createSeriesMarkers(series, markers as unknown as SeriesMarker<TimeType>[]);

	// 添加到圖表容器
	const chartElement = chart.chartElement();
	const chartContainer = chartElement.parentElement;
	if (chartContainer) {
		chartContainer.style.position = 'relative';
	}

	// 點擊事件處理
	const handleClick: MouseEventHandler<Time> = (param: MouseEventParams<Time>) => {
		// 如果沒有點擊到具體位置，則返回
		if (!param.point) {
			options?.onCloseTooltip?.({ visible: false });
			return;
		}

		// 獲取所有標記
		const allMarkers = seriesMarkers.markers() as unknown as ClickableMarker<TimeType>[];

		// 查找點擊的標記（這裡使用簡單的點擊範圍檢測）
		const clickedMarker = allMarkers.find(marker => {
			// 獲取標記的時間對應的x座標
			const timeScale = chart.timeScale();
			const coord = timeScale.timeToCoordinate(marker.time as unknown as Time);
			if (coord === null) return false;

			// 獲取標記的價格對應的y座標
			let priceCoord: number | null = null;

			// 嘗試獲取價格座標
			try {
				// 使用不同的位置策略來獲取座標
				if (marker.position === 'aboveBar') {
					const time = marker.time as unknown as Time;
					const logical = chart.timeScale().timeToIndex(time);
					if (logical !== null) {
						const data = series.dataByIndex(logical);
						if (data && 'high' in data) {
							priceCoord = series.priceToCoordinate(data.high);
						}
					}
				} else if (marker.position === 'belowBar') {
					const time = marker.time as unknown as Time;
					const logical = chart.timeScale().timeToIndex(time);
					if (logical !== null) {
						const data = series.dataByIndex(logical);
						if (data && 'low' in data) {
							priceCoord = series.priceToCoordinate(data.low);
						}
					}
				} else {
					const time = marker.time as unknown as Time;
					const logical = chart.timeScale().timeToIndex(time);
					if (logical !== null) {
						const data = series.dataByIndex(logical);
						if (data && 'close' in data) {
							priceCoord = series.priceToCoordinate(data.close);
						}
					}
				}
			} catch {
				// 忽略錯誤，處理找不到數據的情況
				return false;
			}

			if (priceCoord === null) return false;

			// 簡單的點擊範圍檢測（假設標記大小為特定像素）
			// 調整點擊區域大小以提高可用性
			const markerSize = (marker.size || 1) * 15;
			const pointX = param.point?.x || 0;
			const pointY = param.point?.y || 0;
			const dx = pointX - coord;
			const dy = (pointY - priceCoord) * 0.5;

			return Math.sqrt(dx * dx + dy * dy) <= markerSize;
		});

		if (clickedMarker && chartContainer) {
			options?.onOpenTooltip?.({
				tooltip: clickedMarker.tooltip,
				visible: true,
				position: {
					x: param.point?.x || 0,
					y: param.point?.y || 0,
				},
				container: chartContainer,
				activeMarker: clickedMarker as unknown as ClickableMarker<Time>,
			});

			// 調用點擊回調
			if (options?.onClick) {
				const event = new MouseEvent('click');
				options.onClick(clickedMarker as unknown as ClickableMarker<Time>, event);
			}
		} else {
			// 隱藏彈出窗口
			options?.onCloseTooltip?.({ visible: false });
		}
	};

	chart.subscribeClick(handleClick);

	return {
		setMarkers: newMarkers => {
			seriesMarkers.setMarkers(newMarkers as unknown as SeriesMarker<TimeType>[]);
		},
		markers: () => seriesMarkers.markers() as unknown as readonly ClickableMarker<TimeType>[],
		detach: () => {
			/**
			 * WARNING: It may cause error `Error: Object is disposed`
			 */
			seriesMarkers.detach();
			chart.unsubscribeClick(handleClick);
		},
	};
}
