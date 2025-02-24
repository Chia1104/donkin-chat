export const IntervalFilter = {
	// 6h
	SixHours: '6h',
	// 12h
	TwelveHours: '12h',
	// 1d
	OneDay: '1d',
	// 3d
	ThreeDays: '3d',
	// 7d
	SevenDays: '7d',
	// 30d
	ThirtyDays: '30d',
} as const;

export type IntervalFilter = (typeof IntervalFilter)[keyof typeof IntervalFilter];
