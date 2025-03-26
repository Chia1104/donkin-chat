import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';
import { ChatStoreProvider } from '@/stores/chat';

interface Props {
	children: React.ReactNode;
	chat: React.ReactNode;
}

const Layout = async (props: Props & PagePropsWithLocale) => {
	const { threadId } = await loadAISearchParams(props.searchParams);
	return (
		<ChatStoreProvider
			values={{
				chatId: threadId,
			}}
		>
			<ChatRoomLayout chatBot={props.chat}>{props.children}</ChatRoomLayout>
		</ChatStoreProvider>
	);
};

export default Layout;
