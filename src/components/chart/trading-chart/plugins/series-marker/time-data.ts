import type { Nominal, IRange, Coordinate } from 'lightweight-charts';

import { lowerBound, upperBound } from './algorithms';
import type { RangeImpl } from './range-impl';

export type SeriesItemsIndexesRange = IRange<number>;
export type TimePointIndex = Nominal<number, 'TimePointIndex'>;
export interface TimedValue {
	time: TimePointIndex;
	x: Coordinate;
}

function lowerBoundItemsCompare(item: TimedValue, time: TimePointIndex): boolean {
	return item.time < time;
}

function upperBoundItemsCompare(item: TimedValue, time: TimePointIndex): boolean {
	return time < item.time;
}

export function visibleTimedValues(
	items: TimedValue[],
	range: RangeImpl<TimePointIndex>,
	extendedRange: boolean,
): SeriesItemsIndexesRange {
	const firstBar = range.left();
	const lastBar = range.right();

	const from = lowerBound(items, firstBar, lowerBoundItemsCompare);
	const to = upperBound(items, lastBar, upperBoundItemsCompare);

	if (!extendedRange) {
		return { from, to };
	}

	let extendedFrom = from;
	let extendedTo = to;

	if (from > 0 && from < items.length && items[from].time >= firstBar) {
		extendedFrom = from - 1;
	}

	if (to > 0 && to < items.length && items[to - 1].time <= lastBar) {
		extendedTo = to + 1;
	}

	return { from: extendedFrom, to: extendedTo };
}
