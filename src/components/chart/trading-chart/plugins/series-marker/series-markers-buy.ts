import type { BitmapShapeItemCoordinates } from './utils';
import { shapeSize } from './utils';

export function drawBuy(ctx: CanvasRenderingContext2D, coords: BitmapShapeItemCoordinates, size: number): void {
	const circleSize = shapeSize(size);

	// 保存當前的繪圖狀態
	ctx.save();

	// 移動到指定座標
	ctx.translate(coords.x, coords.y);

	// // 根據 size 縮放
	const scale = circleSize / 12;
	ctx.scale(scale, scale);

	// // 調整定位，使圖形居中
	ctx.translate(-6, -6);

	ctx.beginPath();
	ctx.moveTo(8.16094, 3.98789);
	ctx.lineTo(4.83594, 3.98789);
	ctx.lineTo(3.92344, 2.15039);
	ctx.lineTo(9.07344, 2.15039);
	ctx.lineTo(8.16094, 3.98789);
	ctx.closePath();
	ctx.moveTo(8.14844, 9.85039);
	ctx.lineTo(4.84844, 9.85039);
	ctx.bezierCurveTo(4.2401, 9.85039, 3.72135, 9.63581, 3.29219, 9.20664);
	ctx.bezierCurveTo(2.86302, 8.77747, 2.64844, 8.25731, 2.64844, 7.64614);
	ctx.bezierCurveTo(2.64844, 7.39089, 2.69219, 7.14235, 2.77969, 6.90052);
	ctx.bezierCurveTo(2.86719, 6.65877, 2.99427, 6.43789, 3.16094, 6.23789);
	ctx.lineTo(4.74844, 4.33789);
	ctx.lineTo(8.24844, 4.33789);
	ctx.lineTo(9.83594, 6.23789);
	ctx.bezierCurveTo(10.0026, 6.43789, 10.1297, 6.65877, 10.2172, 6.90052);
	ctx.bezierCurveTo(10.3047, 7.14235, 10.3484, 7.39089, 10.3484, 7.64614);
	ctx.bezierCurveTo(10.3484, 8.25731, 10.1346, 8.77747, 9.70681, 9.20664);
	ctx.bezierCurveTo(9.27898, 9.63581, 8.75952, 9.85039, 8.14844, 9.85039);
	ctx.moveTo(5.29688, 5.5);
	ctx.lineTo(5.29688, 9.02295);
	ctx.lineTo(6.87891, 9.02295);
	ctx.bezierCurveTo(7.63086, 9.02295, 8.09717, 8.63477, 8.09717, 8.01709);
	ctx.bezierCurveTo(8.09717, 7.56055, 7.75781, 7.21143, 7.2915, 7.1748);
	ctx.lineTo(7.2915, 7.13086);
	ctx.bezierCurveTo(7.65283, 7.07715, 7.92871, 6.75244, 7.92871, 6.38135);
	ctx.bezierCurveTo(7.92871, 5.83447, 7.521, 5.5, 6.8374, 5.5);
	ctx.lineTo(5.29688, 5.5);
	ctx.moveTo(6.03418, 6.04688);
	ctx.lineTo(6.64941, 6.04688);
	ctx.bezierCurveTo(7.00098, 6.04688, 7.20361, 6.21777, 7.20361, 6.50342);
	ctx.bezierCurveTo(7.20361, 6.79883, 6.98633, 6.96484, 6.58838, 6.96484);
	ctx.lineTo(6.03418, 6.96484);
	ctx.lineTo(6.03418, 6.04688);
	ctx.moveTo(6.03418, 7.45068);
	ctx.lineTo(6.67383, 7.45068);
	ctx.bezierCurveTo(7.1084, 7.45068, 7.34521, 7.62646, 7.34521, 7.95361);
	ctx.bezierCurveTo(7.34521, 8.29297, 7.11572, 8.47363, 6.69092, 8.47363);
	ctx.lineTo(6.03418, 8.47363);
	ctx.lineTo(6.03418, 7.45068);
	ctx.fill();

	// 恢復繪圖狀態
	ctx.restore();
}
