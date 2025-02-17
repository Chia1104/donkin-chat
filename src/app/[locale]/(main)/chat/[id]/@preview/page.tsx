'use client';

import { AnimatePresence } from 'framer-motion';

import AiSignal from '@/containers/chat/ai-signal';
import { useChatStore } from '@/contexts/chat-provider';
import { QueryType } from '@/enums/queryType.enum';
import { useQueryType } from '@/hooks/useQueryType';
import { cn } from '@/utils/cn';

const Content = () => {
	const { preview } = useChatStore(state => state);
	const [q] = useQueryType();

	if (preview) {
		return preview;
	}

	switch (q) {
		case QueryType.AiSignal:
			return <AiSignal />;
		default:
			return null;
	}
};

const Page = () => {
	const { isPreviewOnly } = useChatStore(state => state);

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
