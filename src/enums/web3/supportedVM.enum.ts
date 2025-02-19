export const SupportedVM = {
	EVM: 'EVM',
	SVM: 'SVM',
} as const;

export type SupportedVM = (typeof SupportedVM)[keyof typeof SupportedVM];
