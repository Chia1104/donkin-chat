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
	image.src = src;
	image.crossOrigin = 'anonymous';
	ctx.beginPath();
	ctx.drawImage(image, coords.x - halfSize, coords.y - halfSize, circleSize, circleSize);
	ctx.fill();
}
