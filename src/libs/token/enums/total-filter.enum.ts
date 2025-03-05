/**
 * @deprecated
 */
export const TotalFilter = {
	// > 5,000
	MoreThan5000: '5000',
	// > 10k
	MoreThan10K: '10000',
	// > 50k
	MoreThan50K: '50000',
} as const;

/**
 * @deprecated
 */
export type TotalFilter = (typeof TotalFilter)[keyof typeof TotalFilter];
