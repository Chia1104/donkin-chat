'use client';

import { createContext, use } from 'react';

import type { CookieFeatures } from '@/libs/flags/services/flags';

interface FlagsContext {
	aiChat: boolean;
	cookieFeatures: CookieFeatures;
	inviteCode: boolean;
}

export const FlagsContext = createContext<FlagsContext | null>(null);

export const FlagsProvider = ({ children, flags }: { children: React.ReactNode; flags: FlagsContext }) => {
	return <FlagsContext value={flags}>{children}</FlagsContext>;
};

export const useFlags = (name = 'useFlags') => {
	const flags = use(FlagsContext);
	if (!flags) {
		throw new Error(`${name} must be used within a FlagsProvider`);
	}
	return flags;
};

export const useAIChat = (name = 'useAIChat') => {
	const { aiChat } = useFlags(name);
	return aiChat;
};

export const useCookieFeatures = (name = 'useCookieFeatures') => {
	const { cookieFeatures } = useFlags(name);
	return cookieFeatures;
};

export const useInviteCode = (name = 'useInviteCode') => {
	const { inviteCode } = useFlags(name);
	return inviteCode;
};
