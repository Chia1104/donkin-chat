export const Sort = {
	// 遞增
	Asc: 'asc',
	// 遞減
	Desc: 'desc',
} as const;

export type Sort = (typeof Sort)[keyof typeof Sort];
