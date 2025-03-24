'use client';

import { Button } from '@heroui/button';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Skeleton } from '@heroui/skeleton';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import Footer from '@/components/commons/footer';
import { useRouter } from '@/i18n/routing';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import Donkin from '../commons/donkin';
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
							void router.push('/');
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
			<main className="flex flex-col items-center justify-center min-h-[calc(100dvh-72px)]">{props.children}</main>
			<Footer />
		</>
	);
};

export default ChatRoomLayout;
