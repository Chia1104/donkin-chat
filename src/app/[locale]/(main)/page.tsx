'use client';

import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useChatStore } from '@/stores/chat';

const TokensList = dynamic(() => import('@/containers/token/tokens-list'));
const Heatmap = dynamic(() => import('@/containers/chat/heatmap'));

const Content = () => {
	const preview = useChatStore(state => state.preview);
	const [searchParams] = useAISearchParams();

	if (preview) {
		return preview;
	}

	switch (searchParams.q) {
		case QueryType.Tokens:
			return <TokensList />;
		case QueryType.Heatmap:
			return <Heatmap />;
		default:
			return null;
	}
};

const Page = () => {
	return (
		<AnimatePresence>
			<Content />
		</AnimatePresence>
	);
};

export default Page;
