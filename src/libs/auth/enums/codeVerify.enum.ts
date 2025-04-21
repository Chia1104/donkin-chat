export const CodeVerify = {
	Unused: 'unused',
	Matched: 'matched',
	Unmatched: 'unmatched',
	Invalid: 'invalid',
} as const;

export type CodeVerify = (typeof CodeVerify)[keyof typeof CodeVerify];
