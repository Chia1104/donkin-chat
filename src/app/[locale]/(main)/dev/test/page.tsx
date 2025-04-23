'use client';

import { Button } from '@heroui/button';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

import OrderPopover from '@/components/token/order-popover';
import { useChatStore } from '@/stores/chat';
import { logger } from '@/utils/logger';

const TestOrderPopover = () => {
	const t = useTranslations('donkin.ask-more.kol-order');
	return (
		<OrderPopover
			meta={{
				buy: 10,
				sell: 5,
				order: 4,
			}}
			total={{
				buy: 100_000_000,
				sell: 50_000_000,
				volume: 100,
			}}
			order={{
				total: 4,
				success: 3,
			}}
			askMore={[t('smart-wallet'), t('kol-order')]}
			onAskMore={logger}
		/>
	);
};

const Page = () => {
	const handleSubmit = useChatStore(state => state.handleSubmit);
	const { address } = useAccount();
	return (
		<div className="flex flex-col gap-4 w-full items-center">
			<p>Wallet address: {address}</p>
			<Button onPress={() => handleSubmit('幫我生成一個 500 字故事')}>Test SSE</Button>
			<TestOrderPopover />
		</div>
	);
};

export default Page;
