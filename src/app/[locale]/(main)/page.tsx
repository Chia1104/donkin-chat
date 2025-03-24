'use client';

import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useChatStore } from '@/stores/chat';
import { cn } from '@/utils/cn';

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
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);

	return (
		<section
			className={cn('p-5 overflow-y-auto h-[calc(100vh-72px)]', !isPreviewOnly ? 'w-full lg:w-2/3 pr-0' : 'w-full')}
		>
			<AnimatePresence>
				<Content />
			</AnimatePresence>
		</section>
	);
};

export default Page;
