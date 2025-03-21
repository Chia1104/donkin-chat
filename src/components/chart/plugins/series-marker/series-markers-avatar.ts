import type { BitmapShapeItemCoordinates } from './utils';
import { shapeSize } from './utils';

export function drawAvatar(
	ctx: CanvasRenderingContext2D,
	coords: BitmapShapeItemCoordinates,
	size: number,
	src: string,
	imageCache: HTMLImageElement | null,
): void {
	if (!imageCache) {
		return;
	}

	const circleSize = shapeSize(size);
	const halfSize = (circleSize - 1) / 2;
	imageCache.crossOrigin = 'anonymous';

	// 使用onload事件確保圖片加載完成後再繪製
	imageCache.onload = () => {
		ctx.beginPath();
		ctx.drawImage(imageCache, coords.x - halfSize, coords.y - halfSize, circleSize, circleSize);
		ctx.fill();
	};

	// 設置src屬性觸發圖片加載
	imageCache.src = src;
}
