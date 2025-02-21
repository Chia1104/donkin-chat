export const Role = {
	Admin: 'admin',
	User: 'user',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
