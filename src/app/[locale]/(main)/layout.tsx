import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import { ChatStoreProvider } from '@/contexts/chat-provider';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';

interface Props {
	children: React.ReactNode;
	chat: React.ReactNode;
}

const Layout = async (props: Props & PagePropsWithLocale) => {
	const { threadId } = await loadAISearchParams(props.searchParams);
	return (
		<ChatRoomLayout>
			<ChatStoreProvider
				values={{
					chatId: threadId,
				}}
			>
				<div className="gap-10 overflow-hidden w-full relative flex">
					{props.children}
					{props.chat}
				</div>
			</ChatStoreProvider>
		</ChatRoomLayout>
	);
};

export default Layout;
