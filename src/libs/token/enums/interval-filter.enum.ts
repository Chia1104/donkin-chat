export const IntervalFilter = {
	OneMinute: '1m',
	FiveMinutes: '5m',
	FifteenMinutes: '15m',
	ThirtyMinutes: '30m',
	OneHour: '1H',
	FourHours: '4H',
	OneDay: '1D',
	OneWeek: '1W',
} as const;

export type IntervalFilter = (typeof IntervalFilter)[keyof typeof IntervalFilter];
