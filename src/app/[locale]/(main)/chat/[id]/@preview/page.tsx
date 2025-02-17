'use client';

import AiSignal from '@/containers/chat/ai-signal';
import { useChatStore } from '@/contexts/chat-provider';
import { QueryType } from '@/enums/queryType.enum';
import { useQueryType } from '@/hooks/useQueryType';

const Page = () => {
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

export default Page;
