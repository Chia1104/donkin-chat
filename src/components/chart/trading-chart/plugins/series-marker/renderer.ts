import type { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from 'fancy-canvas';
import type { Coordinate, IPrimitivePaneRenderer } from 'lightweight-charts';

import { drawAvatar } from './series-markers-avatar';
import { drawBuy } from './series-markers-buy';
import { drawLoudspeaker } from './series-markers-loudspeaker';
import { drawSell } from './series-markers-sell';
import { drawText } from './series-markers-text';
import { TextWidthCache } from './text-width-cache';
import type { TimedValue, SeriesItemsIndexesRange } from './time-data';
import type { SeriesMarkerType } from './types';
import type { BitmapShapeItemCoordinates } from './utils';

export interface SeriesMarkerText {
	content: string;
	x: Coordinate;
	y: Coordinate;
	width: number;
	height: number;
}

export interface SeriesMarkerRendererDataItem extends TimedValue {
	y: Coordinate;
	size: number;
	color: string;
	internalId: number;
	externalId?: string;
	text?: SeriesMarkerText;
	src?: string;
	type: SeriesMarkerType;
}

export interface SeriesMarkerRendererData {
	items: SeriesMarkerRendererDataItem[];
	visibleRange: SeriesItemsIndexesRange | null;
}

export class SeriesMarkersRenderer implements IPrimitivePaneRenderer {
	private _data: SeriesMarkerRendererData | null = null;
	private _textWidthCache: TextWidthCache = new TextWidthCache();
	private _fontSize = -1;
	private _fontFamily = '';
	private _font = '';
	private _defaultFontFamily = `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`;
	private _imageCache: Record<string, HTMLImageElement> = {};

	private getImageCacheBySrc(src: string) {
		if (this._imageCache[src]) {
			return this._imageCache[src];
		}

		return null;
	}

	private setImageCacheBySrc(src: string, image: HTMLImageElement): void {
		this._imageCache[src] = image;
	}

	private makeFont(size: number, family?: string, style?: string): string {
		if (style !== undefined) {
			style = `${style} `;
		} else {
			style = '';
		}

		if (family === undefined) {
			family = this._defaultFontFamily;
		}

		return `${style}${size}px ${family}`;
	}

	public setData(data: SeriesMarkerRendererData): void {
		this._data = data;
	}

	public setParams(fontSize: number, fontFamily: string): void {
		if (this._fontSize !== fontSize || this._fontFamily !== fontFamily) {
			this._fontSize = fontSize;
			this._fontFamily = fontFamily;
			this._font = this.makeFont(fontSize, fontFamily);
			this._textWidthCache.reset();
		}
	}

	public draw(target: CanvasRenderingTarget2D): void {
		target.useBitmapCoordinateSpace((scope: BitmapCoordinatesRenderingScope) => {
			this._drawImpl(scope);
		});
	}

	protected _drawImpl({
		context: ctx,
		horizontalPixelRatio,
		verticalPixelRatio,
	}: BitmapCoordinatesRenderingScope): void {
		if (this._data?.visibleRange == null) {
			return;
		}

		ctx.textBaseline = 'middle';
		ctx.font = this._font;
		for (let index = this._data.visibleRange.from; index < this._data.visibleRange.to; index++) {
			const item = this._data.items[index];
			if (item.text !== undefined) {
				item.text.width = this._textWidthCache.measureText(ctx, item.text.content);
				item.text.height = this._fontSize;
				item.text.x = (item.x - item.text.width / 2) as Coordinate;
			}
			let imageCache = item.src ? this.getImageCacheBySrc(item.src) : null;
			if (!imageCache && item.src) {
				this.setImageCacheBySrc(item.src, new Image());
				imageCache = this.getImageCacheBySrc(item.src);
			}
			drawItem(item, ctx, horizontalPixelRatio, verticalPixelRatio, imageCache);
		}
	}
}

function bitmapShapeItemCoordinates(
	item: SeriesMarkerRendererDataItem,
	horizontalPixelRatio: number,
	verticalPixelRatio: number,
): BitmapShapeItemCoordinates {
	const tickWidth = Math.max(1, Math.floor(horizontalPixelRatio));
	const correction = (tickWidth % 2) / 2;
	return {
		x: Math.round(item.x * horizontalPixelRatio) + correction,
		y: item.y * verticalPixelRatio,
		pixelRatio: horizontalPixelRatio,
	};
}

function drawItem(
	item: SeriesMarkerRendererDataItem,
	ctx: CanvasRenderingContext2D,
	horizontalPixelRatio: number,
	verticalPixelRatio: number,
	imageCache: HTMLImageElement | null,
): void {
	ctx.fillStyle = item.color;
	if (item.text !== undefined) {
		drawText(ctx, item.text.content, item.text.x, item.text.y, horizontalPixelRatio, verticalPixelRatio);
	}

	drawShape(
		item,
		ctx,
		bitmapShapeItemCoordinates(item, horizontalPixelRatio, verticalPixelRatio),
		item.src,
		imageCache,
	);
}

function drawShape(
	item: SeriesMarkerRendererDataItem,
	ctx: CanvasRenderingContext2D,
	coordinates: BitmapShapeItemCoordinates,
	src?: string,
	imageCache?: HTMLImageElement | null,
): void {
	if (item.size === 0) {
		return;
	}

	switch (item.type) {
		case 'loudspeaker':
			drawLoudspeaker(ctx, coordinates, item.size);
			return;
		case 'avatar':
			if (src) {
				drawAvatar(ctx, coordinates, item.size, src, imageCache ?? null);
			}
			return;
		case 'buy':
			drawBuy(ctx, coordinates, item.size);
			return;
		case 'sell':
			drawSell(ctx, coordinates, item.size);
			return;
	}
}
