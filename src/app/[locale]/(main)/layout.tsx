import { headers } from 'next/headers';
import { unauthorized, forbidden } from 'next/navigation';

import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import { ChatStoreProvider } from '@/contexts/chat-provider';
import { Role } from '@/enums/role.enum';
import { loadAISearchParams } from '@/features/ai/services/loadAISearchParams';
import { auth } from '@/features/auth/server';

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
