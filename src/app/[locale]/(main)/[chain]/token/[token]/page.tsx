'use client';

import { AnimatePresence } from 'framer-motion';

import Detail from '@/containers/token/detail';
import { useChatStore } from '@/contexts/chat-provider';
import { cn } from '@/utils/cn';

const Page = () => {
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);
	return (
		<section
			className={cn('p-5 overflow-y-auto h-[calc(100vh-72px)] pr-0', !isPreviewOnly ? 'w-full lg:w-2/3' : 'w-full')}
		>
			<AnimatePresence>
				<Detail />
			</AnimatePresence>
		</section>
	);
};

export default Page;
