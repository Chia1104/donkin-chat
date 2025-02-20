'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import Footer from '@/components/commons/footer';
import XICon from '@/components/icons/x-icon';
import { QueryType } from '@/enums/queryType.enum';
import { useAISearchParams } from '@/features/ai/hooks/useAISearchParams';
import { useRouter } from '@/i18n/routing';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import Donkin from '../commons/donkin';
import EnsGuard from '../web3/ens-guard';
import WalletConnect from '../web3/wallet-connect';

const ChainSelector = dynamic(() => import('@/components/web3/chain-selector'), {
	ssr: false,
	loading: () => <Skeleton className="w-32 rounded-full h-10" />,
});

interface Props {
	children: React.ReactNode;
}

const ChatRoomLayout = (props: Props) => {
	const t = useTranslations('nav');
	const router = useRouter();
	const [searchParams, setSearchParams] = useAISearchParams();

	return (
		<>
			<Navbar
				aria-label="Main Navigation"
				position="static"
				isBordered
				className="bg-black/90"
				classNames={{
					item: 'data-[active=true]:text-primary',
					wrapper: 'min-w-full h-full',
					base: 'h-[72px]',
				}}
			>
				<NavbarContent
					aria-label="Main Navigation Content"
					className={cn('hidden sm:flex gap-4', noto_sans.className)}
					justify="start"
				>
					<NavbarItem
						className="cursor-pointer"
						aria-label="Donkin"
						onClick={() => {
							void router.push('/');
						}}
					>
						<Donkin />
					</NavbarItem>
					<NavbarItem
						aria-label="AI Signal"
						className="cursor-pointer"
						isActive={searchParams.q === QueryType.AiSignal}
						onClick={() => {
							void setSearchParams({ q: QueryType.AiSignal });
						}}
					>
						{t('ai-signal')}
					</NavbarItem>
					<NavbarItem
						aria-label="Whale Ranking"
						className="cursor-pointer"
						isActive={searchParams.q === QueryType.WhaleRanking}
						onClick={() => {
							void setSearchParams({ q: QueryType.WhaleRanking });
						}}
					>
						{t('whale-ranking')}
					</NavbarItem>
					<NavbarItem
						aria-label="Smart Rankings"
						className="cursor-pointer"
						isActive={searchParams.q === QueryType.SmartRankings}
						onClick={() => {
							void setSearchParams({ q: QueryType.SmartRankings });
						}}
					>
						{t('smart-rankings')}
					</NavbarItem>
					<NavbarItem aria-label="Market">
						<Button
							aria-label="Search"
							variant="bordered"
							className="rounded-full border-1 min-w-[200px] justify-between"
							endContent={
								<SearchIcon
									sx={{
										width: 22,
										height: 22,
									}}
								/>
							}
						>
							<span className="text-foreground-500">{t('search-placeholder')}</span>
						</Button>
					</NavbarItem>
				</NavbarContent>
				<NavbarContent aria-label="Main Navigation Content" justify="end">
					<NavbarItem aria-label="X">
						<Button aria-label="X" isIconOnly className="border-1" variant="bordered" radius="full">
							<XICon className="text-white" />
						</Button>
					</NavbarItem>
					<NavbarItem aria-label="Network Selector">
						<ChainSelector />
					</NavbarItem>
					<NavbarItem aria-label="Connect Wallet">
						<WalletConnect />
					</NavbarItem>
					<NavbarItem aria-label="Avatar">
						<EnsGuard pendingFallback={<Avatar aria-label="Avatar" />}>
							<Avatar aria-label="Avatar" />
						</EnsGuard>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<main className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">{props.children}</main>
			<Footer />
		</>
	);
};

export default ChatRoomLayout;
