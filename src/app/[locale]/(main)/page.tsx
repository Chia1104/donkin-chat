'use client';

import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

import { useChatStore } from '@/contexts/chat-provider';
import { QueryType } from '@/enums/queryType.enum';
import { useAISearchParams } from '@/features/ai/hooks/useAISearchParams';
import { cn } from '@/utils/cn';

const AiSignal = dynamic(() => import('@/containers/chat/ai-signal'), { ssr: false });

const Content = () => {
	const preview = useChatStore(state => state.preview);
	const [searchParams] = useAISearchParams();

	if (preview) {
		return preview;
	}

	switch (searchParams.q) {
		case QueryType.AiSignal:
			return <AiSignal />;
		default:
			return null;
	}
};

const Page = () => {
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);

	return (
		<section
			className={cn('p-5 overflow-y-auto h-[calc(100vh-72px)] pr-0', !isPreviewOnly ? 'w-full lg:w-2/3' : 'w-full')}
		>
			<AnimatePresence>
				<Content />
			</AnimatePresence>
		</section>
	);
};

export default Page;
