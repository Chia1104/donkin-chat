import type { IChartApi, ISeriesApi, MouseEventHandler, MouseEventParams, SeriesType, Time } from 'lightweight-charts';

import { createSeriesMarkers } from '../series-marker';
import type { SeriesMarker } from '../series-marker/types';

export interface ClickableMarkerOptions {
	onClick?: (marker: ClickableMarker<Time>, event: MouseEventParams<Time>) => void;
	onOpenTooltip?: (option: {
		tooltip: React.ReactNode;
		visible: true;
		position: { x: number; y: number };
		container: HTMLElement;
		activeMarker: ClickableMarker<Time>;
		marker: ClickableMarker<Time>;
	}) => void;
	onCloseTooltip?: (option: { visible: false }) => void;
	tooltipSize?: {
		width: number;
		height: number;
	};
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

	// 用於檢測是否在標記上的通用函數
	const isOverMarker = (param: MouseEventParams<Time>) => {
		// 如果沒有點擊到具體位置，則返回
		if (!param.point) {
			return null;
		}

		// 獲取所有標記
		const allMarkers = seriesMarkers.markers() as unknown as ClickableMarker<TimeType>[];

		// 查找指標下的標記（使用更精確的點擊範圍檢測）
		return allMarkers.find(marker => {
			// 獲取標記的時間對應的x座標
			const timeScale = chart.timeScale();
			const coord = timeScale.timeToCoordinate(marker.time as unknown as Time);
			if (coord === null) return false;

			const time = marker.time as unknown as Time;
			const logical = chart.timeScale().timeToIndex(time);
			if (logical === null) return false;

			const data = series.dataByIndex(logical);
			if (!data) return false;

			if (!('high' in data && 'low' in data && 'close' in data)) return false;

			// 計算實際標記尺寸
			const sizeMultiplier = marker.size || 1;
			const barSpacing = chart.timeScale().options().barSpacing;
			const actualMarkerSize = Math.min(Math.max(barSpacing, 12), 30) * sizeMultiplier;

			// 增加 shapeMargin 的值，提供更多間距
			// 使用 barSpacing 的 0.3 倍作為基準，但不小於 6 像素
			const shapeMargin = Math.max(barSpacing * 0.3, 6);

			// 根據標記位置獲取正確的y座標
			let priceCoord: number | null = null;
			let offsetY = 0;

			switch (marker.position) {
				case 'aboveBar': {
					// 標記在蠟燭上方（high價格上方）
					const highPrice = data.high;
					priceCoord = series.priceToCoordinate(highPrice);
					if (priceCoord === null) return false;

					// 上方標記的偏移：向上偏移半個標記大小+邊距
					offsetY = -(actualMarkerSize / 2 + shapeMargin);
					break;
				}
				case 'belowBar': {
					// 標記在蠟燭下方（low價格下方）
					const lowPrice = data.low;
					priceCoord = series.priceToCoordinate(lowPrice);
					if (priceCoord === null) return false;

					// 下方標記的偏移：向下偏移半個標記大小+邊距
					offsetY = actualMarkerSize / 2 + shapeMargin;
					break;
				}
				case 'inBar':
				default: {
					// 標記在蠟燭內部（close價格處）
					const closePrice = data.close;
					priceCoord = series.priceToCoordinate(closePrice);
					if (priceCoord === null) return false;
					break;
				}
			}

			// 應用偏移量計算實際y座標
			const actualY = priceCoord + offsetY;

			// 更精確的範圍檢測
			const pointX = param.point?.x || 0;
			const pointY = param.point?.y || 0;

			// 增加點擊範圍以便於點擊，尤其是同一時間段內有多個標記的情況
			// 對於 Y 軸方向，也略微增加範圍（4倍）
			const hitboxMultiplierY = 4; // 增加Y軸方向的點擊範圍
			const halfSizeX = actualMarkerSize / 2;
			const halfSizeY = (actualMarkerSize / 2) * hitboxMultiplierY;

			// 定義點擊區域
			const isInXRange = Math.abs(pointX - coord) <= halfSizeX;
			const isInYRange = Math.abs(pointY - actualY) <= halfSizeY;

			// 返回點是否在標記範圍內
			return isInXRange && isInYRange;
		});
	};

	// 點擊事件處理
	const handleClick: MouseEventHandler<Time> = (param: MouseEventParams<Time>) => {
		// 如果沒有點擊到具體位置，則返回
		if (!param.point) {
			options?.onCloseTooltip?.({ visible: false });
			return;
		}

		const clickedMarker = isOverMarker(param);

		if (clickedMarker && chartContainer) {
			// 計算調整後的位置，避免 tooltip 超出容器
			let posX = param.point?.x || 0;
			let posY = param.point?.y || 0;

			// 如果提供了 tooltipSize，計算邊界以避免超出
			if (options?.tooltipSize) {
				const { width, height } = options.tooltipSize;
				const containerRect = chartContainer.getBoundingClientRect();

				// 計算右邊界，確保 tooltip 不超出右側
				if (posX + width > containerRect.width) {
					posX = Math.max(0, containerRect.width - width);
				}

				// 計算下邊界，確保 tooltip 不超出底部
				if (posY + height > containerRect.height) {
					posY = Math.max(0, containerRect.height - height);
				}
			}

			options?.onOpenTooltip?.({
				tooltip: clickedMarker.tooltip,
				visible: true,
				position: {
					x: posX,
					y: posY,
				},
				container: chartContainer,
				activeMarker: clickedMarker as unknown as ClickableMarker<Time>,
				marker: clickedMarker as unknown as ClickableMarker<Time>,
			});

			// 調用點擊回調
			if (options?.onClick) {
				options.onClick(clickedMarker as unknown as ClickableMarker<Time>, param);
			}
		} else {
			// 隱藏彈出窗口
			options?.onCloseTooltip?.({ visible: false });
		}
	};

	// 鼠標移動處理
	const handleCrosshairMove: MouseEventHandler<Time> = (param: MouseEventParams<Time>) => {
		if (!chartElement) return;

		// 檢查鼠標是否在標記上
		const hoveredMarker = isOverMarker(param);

		// 如果在標記上，更改鼠標樣式為指針
		if (hoveredMarker) {
			chartElement.style.cursor = 'pointer';
		} else {
			// 否則恢復預設樣式
			chartElement.style.cursor = '';
		}
	};

	chart.subscribeClick(handleClick);
	chart.subscribeCrosshairMove(handleCrosshairMove);

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
			chart.unsubscribeCrosshairMove(handleCrosshairMove);
		},
	};
}
