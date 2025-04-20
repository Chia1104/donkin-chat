'use client';

import { useRef } from 'react';

import { Listbox, ListboxItem } from '@heroui/listbox';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Skeleton } from '@heroui/skeleton';
import { usePrivy } from '@privy-io/react-auth';
import { CoinsIcon, HomeIcon, MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useTransitionRouter as useRouter } from 'next-view-transitions';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import Footer from '@/components/commons/footer';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { setFeatureFlag } from '@/libs/flags/actions/feature.action';
import { useGlobalStore } from '@/stores/global/store';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import SearchAddress from '../commons/search-address';
import { Settings } from '../commons/settings';
import Logo from '../donkin/logo';
import Donkin from '../donkin/title';
import { UserPopover } from '../web3/user-popover';
import WalletConnect from '../web3/wallet-connect';

const ChainSelector = dynamic(() => import('@/components/web3/chain-selector'), {
	ssr: false,
	loading: () => <Skeleton className="w-32 rounded-full h-10" />,
});

interface Props {
	children: React.ReactNode;
	chatBot?: React.ReactNode;
	enableSettings?: boolean;
}

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	return (
		<ScrollShadow
			className={cn(
				'p-5 h-fit md:h-[calc(100vh-100px)] flex items-center justify-center',
				isOpen ? 'w-full lg:w-2/3 pr-0' : 'w-full',
			)}
		>
			{children}
		</ScrollShadow>
	);
};

const ChatBotLayout = ({ children }: { children: React.ReactNode }) => {
	const { isMdWidth } = useMediaQuery();
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	if (isOpen && isMdWidth) {
		return (
			<section
				className={cn(
					'h-[calc(100vh-100px)] p-5 md:pl-0 md:py-5 transition-width ease-in-out duration-1000 w-full lg:w-1/2 xl:w-1/3',
				)}
			>
				{children}
			</section>
		);
	} else if (isOpen) {
		return <>{children}</>;
	}

	return null;
};

const MobileDrawer = () => {
	const tRoutes = useTranslations('routes');
	const t = useTranslations('nav');
	const router = useRouter();
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button isIconOnly variant="bordered" radius="full">
					<MenuIcon size={16} />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="p-5">
				<DrawerTitle />
				<SearchAddress className="w-full my-5" />
				<Listbox>
					<ListboxItem>
						<DrawerClose asChild onClick={() => router.push('/')}>
							<Link href="/">
								<span className="flex items-center gap-5">
									<HomeIcon size={16} />
									{tRoutes('home.title')}
								</span>
							</Link>
						</DrawerClose>
					</ListboxItem>
					<ListboxItem>
						<DrawerClose asChild onClick={() => router.push(`/?q=${QueryType.Tokens}`)}>
							<Link
								href={{
									pathname: '/',
									query: {
										q: QueryType.Tokens,
									},
								}}
							>
								<span className="flex items-center gap-5">
									<CoinsIcon size={16} />
									{t('all-tokens')}
								</span>
							</Link>
						</DrawerClose>
					</ListboxItem>
				</Listbox>
			</DrawerContent>
		</Drawer>
	);
};

const Navigation = ({ enableSettings }: { enableSettings?: boolean }) => {
	const t = useTranslations('nav');
	const tDevMode = useTranslations('dev-mode');
	const router = useRouter();
	const clickCountRef = useRef(0);
	const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
	const { ready, authenticated } = usePrivy();

	const handleClickFiveTimeToToggleFeatureFlag = () => {
		void setFeatureFlag(!enableSettings);
		toast.success(tDevMode('toggle'), {
			position: 'top-center',
		});
	};

	const handleDonkinClick = () => {
		clickCountRef.current += 1;

		if (clickTimerRef.current) {
			clearTimeout(clickTimerRef.current);
		}

		if (clickCountRef.current === 5) {
			handleClickFiveTimeToToggleFeatureFlag();
			clickCountRef.current = 0;
		} else {
			clickTimerRef.current = setTimeout(() => {
				clickCountRef.current = 0;
			}, 1500);
		}

		router.push(`/?q=${QueryType.Heatmap}`);
	};

	return (
		<Navbar
			aria-label="Main Navigation"
			position="static"
			className="bg-root backdrop-saturate-0"
			classNames={{
				item: 'data-[active=true]:text-primary',
				wrapper: 'min-w-full h-full',
				base: 'h-[60px]',
			}}
		>
			<NavbarContent
				aria-label="Main Navigation Content"
				className={cn('flex lg:gap-10 gap-4', noto_sans.className)}
				justify="start"
			>
				<NavbarItem className="cursor-pointer" aria-label="Donkin" onClick={handleDonkinClick}>
					<Donkin />
				</NavbarItem>
				<NavbarItem
					aria-label={t('all-tokens')}
					className="cursor-pointer hidden md:block"
					onClick={() => {
						void router.push(`/?q=${QueryType.Tokens}`);
					}}
				>
					{t('all-tokens')}
				</NavbarItem>
				<NavbarItem aria-label={t('search-placeholder')} className="hidden md:block">
					<SearchAddress />
				</NavbarItem>
			</NavbarContent>
			<NavbarContent aria-label="Main Navigation Content" justify="end" className="gap-4">
				{enableSettings && (
					<NavbarItem aria-label="Settings">
						<Settings />
					</NavbarItem>
				)}
				<NavbarItem className="md:hidden">
					<MobileDrawer />
				</NavbarItem>
				{ready && authenticated ? (
					<NavbarItem aria-label="User">
						<UserPopover />
					</NavbarItem>
				) : (
					<>
						<NavbarItem aria-label="Connect Wallet">
							<WalletConnect />
						</NavbarItem>
						<NavbarItem aria-label="Network Selector">
							<ChainSelector />
						</NavbarItem>
					</>
				)}
			</NavbarContent>
		</Navbar>
	);
};

const ChatRoomLayout = (props: Props) => {
	return (
		<>
			<Navigation enableSettings={props.enableSettings} />
			<main className="gap-5 lg:gap-8 overflow-hidden w-full relative flex items-center justify-center md:min-h-[calc(100dvh-100px)]">
				<ContentLayout>{props.children}</ContentLayout>
				<ChatBotLayout>{props.chatBot}</ChatBotLayout>
			</main>
			<Footer />
			<Logo className="fixed bottom-5 right-5 z-[99] size-20" opacityOnStatus="close" hiddenOnStatus="open" />
		</>
	);
};

export default ChatRoomLayout;
