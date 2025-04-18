'use client';

import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { DEFAULT_THREAD_ID } from '@/libs/ai/constants';
import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useChatStore } from '@/stores/chat';

const TokensList = dynamic(() => import('@/containers/token/tokens-list'));
const Heatmap = dynamic(() => import('@/containers/token/heatmap'));

const Content = () => {
	const [searchParams] = useAISearchParams();

	switch (searchParams.q) {
		case QueryType.Tokens:
			return <TokensList />;
		case QueryType.Heatmap:
			return <Heatmap />;
		default:
			return null;
	}
};

const ThreadId = () => {
	const threadId = useChatStore(state => state.threadId);
	const [, setSearchParams] = useAISearchParams();
	useEffect(() => {
		if (threadId && threadId !== DEFAULT_THREAD_ID) {
			void setSearchParams({ threadId });
		}
	}, [setSearchParams, threadId]);
	return null;
};

const TokenPage = () => {
	return (
		<>
			<Content />
			<ThreadId />
		</>
	);
};

export default TokenPage;
