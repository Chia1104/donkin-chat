'use client';

import { AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

import { ChatStoreProvider } from '@/contexts/chat-provider';
import { cn } from '@/utils/cn';

const Layout = (props: { chat: React.ReactNode; preview: React.ReactNode }) => {
	const { id } = useParams<{ id: string }>();

	return (
		<ChatStoreProvider
			values={{
				chatId: id,
			}}
		>
			<div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-10 overflow-hidden w-full relative">
				<section className={cn('p-5 overflow-y-auto h-[calc(100vh-72px)] pr-0', 'lg:col-span-2')}>
					<AnimatePresence>{props.preview}</AnimatePresence>
				</section>
				<section className={cn('h-[calc(100vh-72px)] w-full p-5 md:pl-0 md:py-5')}>{props.chat}</section>
			</div>
		</ChatStoreProvider>
	);
};

export default Layout;
