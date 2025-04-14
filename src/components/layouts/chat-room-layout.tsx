'use client';

import { useRef } from 'react';

import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';
import { useTranslations } from 'next-intl';
import { useTransitionRouter as useRouter } from 'next-view-transitions';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import Footer from '@/components/commons/footer';
import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { setFeatureFlag } from '@/libs/flags/actions/feature.action';
import { useGlobalStore } from '@/stores/global/store';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import SearchAddress from '../commons/search-address';
import { Settings } from '../commons/settings';
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
	enableSettings?: boolean;
}

const ChatRoomLayout = (props: Props) => {
	const t = useTranslations('nav');
	const tDevMode = useTranslations('dev-mode');
	const router = useRouter();
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const clickCountRef = useRef(0);
	const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

	const handleClickFiveTimeToToggleFeatureFlag = () => {
		void setFeatureFlag(!props.enableSettings);
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
					<NavbarItem className="cursor-pointer" aria-label="Donkin" onClick={handleDonkinClick}>
						<Donkin />
					</NavbarItem>
					<NavbarItem
						aria-label={t('all-tokens')}
						className="cursor-pointer"
						onClick={() => {
							void router.push(`/?q=${QueryType.Tokens}`);
						}}
					>
						{t('all-tokens')}
					</NavbarItem>
					<NavbarItem aria-label={t('search-placeholder')}>
						<SearchAddress />
					</NavbarItem>
				</NavbarContent>
				<NavbarContent aria-label="Main Navigation Content" justify="end" className="gap-10">
					{props.enableSettings && (
						<NavbarItem aria-label="Settings">
							<Settings />
						</NavbarItem>
					)}
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
							'h-[calc(100vh-72px)] p-5 md:pl-0 md:py-5 transition-width ease-in-out duration-1000 w-full md:w-1/2 lg:w-1/3',
						)}
					>
						{props.chatBot}
					</section>
				)}
			</main>
			<Footer />
			<Logo className="fixed bottom-5 right-5 z-[99] size-16" opacityOnStatus="close" hiddenOnStatus="open" />
		</>
	);
};

export default ChatRoomLayout;
