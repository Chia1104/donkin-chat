'use client';

import { memo, useCallback } from 'react';

import { Image } from '@heroui/image';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import CoinIcon from '@/components/icons/coin-icon';
import HotIcon from '@/components/icons/hot-icon';
import WaleIcon from '@/components/icons/wale-icon';
import WalletIcon from '@/components/icons/wallet-icon';
import ActionCard, { ActionBody } from '@/components/ui/action-card';

interface Props {
	onAction?: (action: string) => void;
	currentCoin?: string;
}

const DefaultPrompt = ({ currentCoin = 'XX', ...props }: Props) => {
	const t = useTranslations('chat');

	const handleAction = useCallback(
		(action: string) => {
			if (props.onAction) {
				props.onAction(action);
			}
		},
		[props],
	);

	return (
		<section className="flex flex-col items-center justify-center w-full h-full max-w-[350px] gap-2 prose prose-invert">
			<div className="flex flex-col items-center justify-center w-full max-w-[285px]">
				<Image
					className="mb-2"
					as={NextImage}
					alt="sparkless"
					src="/assets/images/sparkless.png"
					width={96}
					height={96}
					removeWrapper
					aria-label="sparkless"
				/>
				<h2 className="mt-0 mb-2">{t('donkin-title')}</h2>
				<p className="text-xs text-center">{t('donkin-subtitle')}</p>
			</div>
			<div className="border-1 border-divider flex flex-col gap-2 rounded-lg p-3 w-full not-prose">
				<p className="text-xs">{t('default-prompt.title')}</p>
				<ActionCard onPress={() => handleAction(t('default-prompt.latest-coins'))}>
					<ActionBody icon={<HotIcon />} label={t('default-prompt.latest-coins')} />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.smart-wallet-recommendations'))}>
					<ActionBody icon={<WalletIcon />} label={t('default-prompt.smart-wallet-recommendations')} />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.largest-whales'))}>
					<ActionBody icon={<WaleIcon />} label={t('default-prompt.largest-whales')} />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.info-about', { item: 'XX' }))}>
					<ActionBody icon={<CoinIcon />} label={t('default-prompt.info-about', { item: currentCoin })} />
				</ActionCard>
			</div>
		</section>
	);
};

export default memo(DefaultPrompt, (prev, next) => {
	return prev.currentCoin === next.currentCoin;
});
