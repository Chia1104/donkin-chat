import type { BitmapShapeItemCoordinates } from './utils';
import { shapeSize } from './utils';

export function drawAvatar(
	ctx: CanvasRenderingContext2D,
	coords: BitmapShapeItemCoordinates,
	size: number,
	src: string,
): void {
	const circleSize = shapeSize(size);
	const halfSize = (circleSize - 1) / 2;
	const image = new Image();
	image.crossOrigin = 'anonymous';

	// 使用onload事件確保圖片加載完成後再繪製
	image.onload = () => {
		ctx.beginPath();
		ctx.drawImage(image, coords.x - halfSize, coords.y - halfSize, circleSize, circleSize);
		ctx.fill();
	};

	// 設置src屬性觸發圖片加載
	image.src = src;
}
