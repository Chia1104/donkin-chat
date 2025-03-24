'use client';

import AppLoading from '@/components/commons/app-loading';
import { useChatStore } from '@/stores/chat';
import { cn } from '@/utils/cn';

const Loading = () => {
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);
	return (
		<AppLoading
			spinnerOnly
			className={cn('h-[calc(100vh-72px)]', !isPreviewOnly ? 'w-full lg:w-2/3 lg:max-w-2/3' : 'w-full')}
		/>
	);
};

export default Loading;
