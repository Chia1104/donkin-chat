import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import Chat from '@/containers/chat/chat';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';
import { aiChatFlag, cookieFeaturesFlag } from '@/libs/flags/services/flags';
import { ChatStoreProvider } from '@/stores/chat';

interface Props {
	children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
	const tRoutes = await getTranslations('routes');
	return {
		title: tRoutes('home.title'),
	};
}

const Layout = async (props: Props & PagePropsWithLocale) => {
	const [{ threadId }, { locale }] = await Promise.all([
		/**
		 * TODO: refactor chat layout, currently the searchParams is undefined
		 */
		loadAISearchParams(props.searchParams),
		props.params,
	]);
	const [enabled, cookieFeatures] = await Promise.all([aiChatFlag(), cookieFeaturesFlag()]);
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
			<ChatRoomLayout enableSettings={cookieFeatures.settings} chatBot={<Chat />}>
				{props.children}
			</ChatRoomLayout>
		</ChatStoreProvider>
	);
};

export default Layout;
