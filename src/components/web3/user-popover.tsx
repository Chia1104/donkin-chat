'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet } from 'lucide-react';
import { Unplug } from 'lucide-react';
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
					startContent={<Avatar size="sm" className="w-6 h-6" />}
					radius="full"
					aria-label={t('address')}
				>
					<span className="flex items-center gap-1">
						<p className="text-xs text-gray-500">{truncateMiddle(user?.wallet?.address ?? '', 10)}</p>{' '}
						<CopyButton content={user?.wallet?.address ?? ''} />
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
						startContent={<Wallet size={14} />}
						classNames={{
							title: 'text-xs',
							base: 'gap-4 p-2 px-4',
						}}
					>
						{t('address')}
					</ListboxItem>
					<ListboxItem
						key="logout"
						aria-label={t('disconnect')}
						startContent={<Unplug size={14} />}
						classNames={{
							title: 'text-xs',
							base: 'gap-4 p-2 px-4',
						}}
					>
						{t('disconnect')}
					</ListboxItem>
				</Listbox>
			</PopoverContent>
		</Popover>
	);
};
