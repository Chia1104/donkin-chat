'use client';

import { useEffect } from 'react';

import { useAuthGuard } from '@/components/auth/auth-guard';
import { useCMD } from '@/hooks/useCMD';
import { DEFAULT_THREAD_ID } from '@/libs/ai/constants';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useChatStore } from '@/stores/chat';
import { useGlobalStore } from '@/stores/global/store';

export const DonkinPlugin = () => {
	const threadId = useChatStore(state => state.threadId);
	const [, setSearchParams] = useAISearchParams();
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const completeDonkin = useGlobalStore(state => state.completeDonkin);
	const { canActivate } = useAuthGuard('DonkinPlugin');

	useCMD(
		false,
		{
			cmd: 'i',
			onKeyDown: () => {
				if (canActivate) {
					completeDonkin();
					toggleDonkin();
				}
			},
		},
		[canActivate],
	);

	useEffect(() => {
		if (threadId && threadId !== DEFAULT_THREAD_ID) {
			void setSearchParams({ threadId });
		}
	}, [setSearchParams, threadId]);

	return null;
};
