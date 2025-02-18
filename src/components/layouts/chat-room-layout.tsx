'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslations } from 'next-intl';

import Footer from '@/components/commons/footer';
import NetworkSelector from '@/components/commons/network-selector';
import XICon from '@/components/icons/x-icon';
import { QueryType } from '@/enums/queryType.enum';
import { useQueryType } from '@/hooks/useQueryType';
import { noto_sans } from '@/themes/fonts';
import { cn } from '@/utils/cn';

import Donkin from '../commons/donkin';

interface Props {
	children: React.ReactNode;
}

const ChatRoomLayout = (props: Props) => {
	const t = useTranslations('nav');
	const tAction = useTranslations('action');
	const [q, setQ] = useQueryType();

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
					<NavbarItem aria-label="Donkin">
						<Donkin />
					</NavbarItem>
					<NavbarItem
						aria-label="AI Signal"
						className="cursor-pointer"
						isActive={q === QueryType.AiSignal}
						onClick={() => setQ(QueryType.AiSignal)}
					>
						{t('ai-signal')}
					</NavbarItem>
					<NavbarItem
						aria-label="Whale Ranking"
						className="cursor-pointer"
						isActive={q === QueryType.WhaleRanking}
						onClick={() => setQ(QueryType.WhaleRanking)}
					>
						{t('whale-ranking')}
					</NavbarItem>
					<NavbarItem
						aria-label="Smart Rankings"
						className="cursor-pointer"
						isActive={q === QueryType.SmartRankings}
						onClick={() => setQ(QueryType.SmartRankings)}
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
						<NetworkSelector />
					</NavbarItem>
					<NavbarItem aria-label="Connect Wallet">
						<Button
							aria-label="Connect Wallet"
							color="primary"
							className="rounded-full"
							startContent={<AccountBalanceWalletOutlinedIcon />}
						>
							{tAction('connect-wallet')}
						</Button>
					</NavbarItem>
					<NavbarItem aria-label="Avatar">
						<Avatar aria-label="Avatar" />
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<main className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">{props.children}</main>
			<Footer />
		</>
	);
};

export default ChatRoomLayout;
