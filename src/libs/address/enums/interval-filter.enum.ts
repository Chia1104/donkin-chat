export const IntervalFilter = {
	OneWeek: '1W',
	OneMonth: '30D',
} as const;

export type IntervalFilter = (typeof IntervalFilter)[keyof typeof IntervalFilter];
