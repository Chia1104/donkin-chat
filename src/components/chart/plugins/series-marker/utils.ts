import { ceiledEven, ceiledOdd } from '@/utils/mathex';

const enum Constants {
	MinShapeSize = 12,
	MaxShapeSize = 30,
	MinShapeMargin = 3,
}

function size(barSpacing: number, coeff: number): number {
	const result = Math.min(Math.max(barSpacing, Constants.MinShapeSize), Constants.MaxShapeSize) * coeff;
	return ceiledOdd(result);
}

export function shapeSize(originalSize: number): number {
	return size(originalSize, 2);
}

export function calculateShapeHeight(barSpacing: number): number {
	return ceiledEven(size(barSpacing, 1));
}

export function shapeMargin(barSpacing: number): number {
	return Math.max(size(barSpacing, 0.1), Constants.MinShapeMargin);
}

export interface BitmapShapeItemCoordinates {
	x: number;
	y: number;
	pixelRatio: number;
}

export function calculateAdjustedMargin(margin: number, hasSide: boolean, hasInBar: boolean): number {
	if (hasSide) {
		return margin;
	} else if (hasInBar) {
		return Math.ceil(margin / 2);
	}

	return 0;
}
