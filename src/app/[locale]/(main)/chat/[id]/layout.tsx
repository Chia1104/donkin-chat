'use client';

import { useParams } from 'next/navigation';

import { ChatStoreProvider } from '@/contexts/chat-provider';

const Layout = (props: { chat: React.ReactNode; preview: React.ReactNode }) => {
	const { id } = useParams<{ id: string }>();

	return (
		<ChatStoreProvider
			values={{
				chatId: id,
			}}
		>
			<div className="gap-10 overflow-hidden w-full relative flex">
				{props.preview}
				{props.chat}
			</div>
		</ChatStoreProvider>
	);
};

export default Layout;
