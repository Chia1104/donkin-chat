import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';
import { aiChatFlag } from '@/libs/flags/services/flags';
import { ChatStoreProvider } from '@/stores/chat';

interface Props {
	children: React.ReactNode;
	chat: React.ReactNode;
}

const Layout = async (props: Props & PagePropsWithLocale) => {
	const [{ threadId }, { locale }] = await Promise.all([loadAISearchParams(props.searchParams), props.params]);
	const enabled = await aiChatFlag();
	return (
		<ChatStoreProvider
			values={{
				threadId,
				enabled,
				context: {
					conv_id: threadId,
					token: '',
					locale,
				},
			}}
		>
			<ChatRoomLayout chatBot={props.chat}>{props.children}</ChatRoomLayout>
		</ChatStoreProvider>
	);
};

export default Layout;
