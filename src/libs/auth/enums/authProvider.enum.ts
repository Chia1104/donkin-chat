export const Provider = {
	google: 'google',
	github: 'github',
	resend: 'resend',
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
