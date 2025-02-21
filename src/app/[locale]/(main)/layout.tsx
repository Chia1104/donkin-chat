import { headers } from 'next/headers';
import { unauthorized, forbidden } from 'next/navigation';

import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import { ChatStoreProvider } from '@/contexts/chat-provider';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';
import { Role } from '@/libs/auth/enums/role.enum';
import { auth } from '@/libs/auth/server';

interface Props {
	children: React.ReactNode;
	chat: React.ReactNode;
}

const Layout = async (props: Props & PagePropsWithLocale) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		unauthorized();
	} else if (session.user.role !== Role.Admin) {
		forbidden();
	}
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
