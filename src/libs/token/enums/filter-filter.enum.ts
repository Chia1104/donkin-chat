export const Filter = {
	// 推荐
	Recommend: 'recommend',
	// 自选
	Manual: 'manual',
} as const;

export type Filter = (typeof Filter)[keyof typeof Filter];
