import type { BitmapShapeItemCoordinates } from './utils';
import { shapeSize } from './utils';

export function drawSell(ctx: CanvasRenderingContext2D, coords: BitmapShapeItemCoordinates, size: number): void {
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

	// 第二條路徑：M8.14844 9.85039H4.84844C4.2401 9.85039 3.72135 9.63581...
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

	// 第三條路徑：M5.15088 7.87616C5.19238 8.50116 5.72461 8.90399...
	ctx.moveTo(5.15088, 7.87616);
	ctx.bezierCurveTo(5.19238, 8.50116, 5.72461, 8.90399, 6.56689, 8.90399);
	ctx.bezierCurveTo(7.4458, 8.90399, 7.98779, 8.4621, 7.98779, 7.76385);
	ctx.lineTo(7.98779, 7.76141);
	ctx.bezierCurveTo(7.98779, 7.2121, 7.66309, 6.91425, 6.91846, 6.76044);
	ctx.lineTo(6.54492, 6.68475);
	ctx.bezierCurveTo(6.12988, 6.5993, 5.95898, 6.46259, 5.95898, 6.23309);
	ctx.lineTo(5.95898, 6.23065);
	ctx.bezierCurveTo(5.95898, 5.96698, 6.20068, 5.80096, 6.56445, 5.79852);
	ctx.bezierCurveTo(6.93555, 5.79852, 7.17969, 5.9743, 7.22119, 6.22577);
	ctx.lineTo(7.22607, 6.25507);
	ctx.lineTo(7.91943, 6.22333);
	ctx.lineTo(7.91699, 6.22333);
	ctx.bezierCurveTo(7.87061, 5.63495, 7.38721, 5.20038, 6.56445, 5.20038);
	ctx.bezierCurveTo(5.7832, 5.20038, 5.22168, 5.63251, 5.22168, 6.2868);
	ctx.lineTo(5.22168, 6.28925);
	ctx.bezierCurveTo(5.22168, 6.82391, 5.53662, 7.16571, 6.26904, 7.31464);
	ctx.lineTo(6.64014, 7.39032);
	ctx.bezierCurveTo(7.07715, 7.48065, 7.25049, 7.61005, 7.25049, 7.84198);
	ctx.lineTo(7.25049, 7.84442);
	ctx.bezierCurveTo(7.25049, 8.11542, 6.97949, 8.30341, 6.58643, 8.30341);
	ctx.bezierCurveTo(6.17383, 8.30341, 5.88818, 8.12518, 5.86133, 7.86151);
	ctx.lineTo(5.85889, 7.8371);
	ctx.lineTo(5.14844, 7.87616);
	ctx.closePath();

	// 填充路徑
	ctx.fill();

	// 恢復繪圖狀態
	ctx.restore();
}
