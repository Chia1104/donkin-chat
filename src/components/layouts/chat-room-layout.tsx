'use client';

import { Button } from '@heroui/button';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import Footer from '@/components/commons/footer';
import { useRouter } from '@/i18n/routing';
import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useGlobalStore } from '@/stores/global/store';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import Logo from '../donkin/logo';
import Donkin from '../donkin/title';
import WalletConnect from '../web3/wallet-connect';

const ChainSelector = dynamic(() => import('@/components/web3/chain-selector'), {
	ssr: false,
	loading: () => <Skeleton className="w-32 rounded-full h-10" />,
});

interface Props {
	children: React.ReactNode;
	chatBot?: React.ReactNode;
}

const ChatRoomLayout = (props: Props) => {
	const t = useTranslations('nav');
	const router = useRouter();
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const [, setSearchParams] = useAISearchParams();

	return (
		<>
			<Navbar
				aria-label="Main Navigation"
				position="static"
				className="bg-root backdrop-saturate-0"
				classNames={{
					item: 'data-[active=true]:text-primary',
					wrapper: 'min-w-full h-full',
					base: 'h-[72px]',
				}}
			>
				<NavbarContent
					aria-label="Main Navigation Content"
					className={cn('hidden sm:flex gap-10', noto_sans.className)}
					justify="start"
				>
					<NavbarItem
						className="cursor-pointer"
						aria-label="Donkin"
						onClick={() => {
							void setSearchParams({
								q: QueryType.Heatmap,
							});
						}}
					>
						<Donkin />
					</NavbarItem>
					<NavbarItem
						aria-label="AI Signal"
						className="cursor-pointer"
						onClick={() => {
							void router.push('/');
						}}
					>
						{t('all-tokens')}
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
				<NavbarContent aria-label="Main Navigation Content" justify="end" className="gap-10">
					<NavbarItem aria-label="Connect Wallet">
						<WalletConnect />
					</NavbarItem>
					<NavbarItem aria-label="Network Selector">
						<ChainSelector />
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<main className="gap-10 overflow-hidden w-full relative flex items-center justify-center min-h-[calc(100dvh-72px)]">
				<section
					className={cn(
						'p-5 overflow-y-auto h-[calc(100vh-72px)] flex items-center justify-center',
						isOpen ? 'w-full lg:w-2/3 pr-0' : 'w-full',
					)}
				>
					{props.children}
				</section>
				{isOpen && (
					<section
						className={cn(
							'h-[calc(100vh-72px)] p-5 md:pl-0 md:py-5 transition-width ease-in-out duration-1000 w-full lg:w-1/3',
						)}
					>
						{props.chatBot}
					</section>
				)}
			</main>
			<Footer />
			<Logo className="fixed bottom-5 right-5 z-[99]" opacityOnStatus="close" hiddenOnStatus="open" />
		</>
	);
};

export default ChatRoomLayout;
