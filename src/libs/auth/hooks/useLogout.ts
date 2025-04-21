import { useCallback, useTransition } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useTransitionRouter } from 'next-view-transitions';

import { logout } from '../actions/invitations.action';

export const useLogout = () => {
	const [isPending, startTransition] = useTransition();
	const { logout: privyLogout } = usePrivy();
	const router = useTransitionRouter();

	const handleLogout = useCallback(() => {
		startTransition(async () => {
			await logout();
			await privyLogout();
			router.refresh();
		});
	}, [privyLogout, router, startTransition]);

	return [isPending, handleLogout] as const;
};
