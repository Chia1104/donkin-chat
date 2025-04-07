export const IntervalFilter = {
	OneWeek: '7d',
	OneMonth: '30d',
} as const;

export type IntervalFilter = (typeof IntervalFilter)[keyof typeof IntervalFilter];
