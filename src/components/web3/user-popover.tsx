'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { usePrivy } from '@privy-io/react-auth';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';

import { useLogout } from '@/libs/auth/hooks/useLogout';
import { useWeb3Store } from '@/stores/web3/store';
import { truncateMiddle } from '@/utils/format';

import CopyButton from '../commons/copy-button';

export const UserPopover = () => {
	const { ready, authenticated, user } = usePrivy();
	const symbol = useWeb3Store(store => store.symbol);
	const router = useTransitionRouter();
	const t = useTranslations('wallet-profile');
	const [isPending, handleLogout] = useLogout();
	return (
		<Popover
			isTriggerDisabled={!ready || !authenticated}
			classNames={{
				base: 'w-[140px]',
			}}
			radius="sm"
		>
			<PopoverTrigger>
				<Button
					as="span"
					variant="bordered"
					startContent={
						<Avatar size="sm" className="w-6 h-6 overflow-visible" src="/assets/images/default-avatar.png" />
					}
					radius="full"
					aria-label={t('address')}
					className="px-2 gap-2"
				>
					<span className="flex items-center gap-1">
						<p className="text-[13px]">{truncateMiddle(user?.wallet?.address ?? '', 10)}</p>{' '}
						<CopyButton content={user?.wallet?.address ?? ''} className="bg-transparent" />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="px-0">
				<Listbox
					disabledKeys={isPending ? ['logout'] : []}
					aria-label={t('address')}
					onAction={key => {
						switch (key) {
							case 'profile':
								router.push(`/${symbol.toLowerCase()}/address/${user?.wallet?.address}`);
								break;
							case 'logout':
								handleLogout();
								break;
						}
					}}
					classNames={{
						base: 'px-0',
					}}
				>
					<ListboxItem
						key="profile"
						aria-label={t('address')}
						startContent={
							<Image src="/assets/images/wallet.svg" width={20} height={20} alt="wallet" aria-label="wallet" />
						}
						classNames={{
							title: 'text-xs',
							base: 'gap-[10px] p-2 px-4',
						}}
					>
						{t('address')}
					</ListboxItem>
					<ListboxItem
						key="logout"
						aria-label={t('disconnect')}
						startContent={
							<Image
								src="/assets/images/disconnect.svg"
								width={20}
								height={20}
								alt="disconnect"
								aria-label="disconnect"
							/>
						}
						classNames={{
							title: 'text-xs',
							base: 'gap-[10px] p-2 px-4',
						}}
					>
						{t('disconnect')}
					</ListboxItem>
				</Listbox>
			</PopoverContent>
		</Popover>
	);
};
