export const IntervalFilter = {
	OneMinute: '1m',
	FiveMinutes: '5m',
	FifteenMinutes: '15m',
	ThirtyMinutes: '30m',
	OneHour: '1h',
	FourHours: '4h',
	OneDay: '1d',
	OneWeek: '1week',
} as const;

export type IntervalFilter = (typeof IntervalFilter)[keyof typeof IntervalFilter];
