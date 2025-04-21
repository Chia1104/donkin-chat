import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

import { AuthGuard } from '@/components/auth/auth-guard';
import ChatRoomLayout from '@/components/layouts/chat-room-layout';
import Chat from '@/containers/chat/chat';
import { FlagsProvider } from '@/contexts/flags-provider';
import { loadAISearchParams } from '@/libs/ai/services/loadAISearchParams';
import { INVITATION_TOKEN_NAME } from '@/libs/auth/constants';
import { verifyInvitationToken } from '@/libs/auth/resources/invitations.resource.rsc';
import { aiChatFlag, cookieFeaturesFlag, inviteCodeFlag } from '@/libs/flags/services/flags';
import { verifyAuthToken as verifyProvyAuthToken } from '@/libs/privy/services/auth.service';
import { ChatStoreProvider } from '@/stores/chat';
import { HEADERS_SEARCH_PARAMS } from '@/utils/constants';
import { tryCatch } from '@/utils/try-catch';

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
	const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
	const searchParams = Object.fromEntries(new URLSearchParams(headerStore.get(HEADERS_SEARCH_PARAMS) || ''));
	const [{ threadId }, { locale }] = await Promise.all([loadAISearchParams(searchParams), props.params]);
	const [aiChat, cookieFeatures, inviteCode] = await Promise.all([
		aiChatFlag(),
		cookieFeaturesFlag(),
		inviteCodeFlag(),
	]);

	const token = cookieStore.get(INVITATION_TOKEN_NAME)?.value;
	const { data: verifyInvitationTokenData, error: verifyInvitationTokenError } = await tryCatch(
		verifyInvitationToken(token),
	);

	const { data: verifyAuthTokenData, error: verifyAuthTokenError } = await tryCatch(verifyProvyAuthToken());

	return (
		<ChatStoreProvider
			values={{
				threadId,
				enabled: aiChat,
				context: {
					conv_id: threadId,
					token: '',
					locale,
				},
			}}
		>
			<FlagsProvider flags={{ aiChat, cookieFeatures, inviteCode }}>
				<AuthGuard
					isRegistered={verifyInvitationTokenError ? false : verifyInvitationTokenData ? true : false}
					isWalletConnected={verifyAuthTokenError ? false : verifyAuthTokenData ? true : false}
					enabled={inviteCode}
				>
					<ChatRoomLayout enableSettings={cookieFeatures.settings} chatBot={<Chat />}>
						{props.children}
					</ChatRoomLayout>
				</AuthGuard>
			</FlagsProvider>
		</ChatStoreProvider>
	);
};

export default Layout;
