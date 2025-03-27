'use client';

import { Button } from '@heroui/button';

import { useChatStore } from '@/stores/chat/store';

const Page = () => {
	const { internal_handleSSE } = useChatStore();

	return (
		<Button
			onPress={() =>
				internal_handleSSE([
					{
						content: '幫我生成一個 500 字故事',
						role: 'user',
						threadId: '123',
						createdAt: new Date(),
						id: '123',
						parentId: null,
						reasoning: null,
					},
				])
			}
		>
			Test SSE
		</Button>
	);
};

export default Page;
