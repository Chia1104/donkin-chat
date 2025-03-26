'use client';

import { memo, useCallback } from 'react';

import { useTranslations } from 'next-intl';

import Logo from '@/components/commons/donkin/logo';
import ActionCard, { ActionBody } from '@/components/ui/action-card';
import { DonkinStatus } from '@/enums/donkin.enum';

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
		<section className="flex flex-col items-center justify-center w-full h-full max-w-[350px] gap-5 prose prose-invert">
			<div className="flex flex-col items-center justify-center w-full max-w-[285px] gap-3">
				<Logo className="size-[78px]" current={DonkinStatus.Open} />
				<h2 className="mt-0 mb-2">{t('donkin-title')}</h2>
				<p className="text-xs text-center">{t('donkin-subtitle')}</p>
			</div>
			<div className="flex flex-col gap-4 rounded-lg p-3 w-full not-prose">
				<ActionCard onPress={() => handleAction(t('default-prompt.latest-coins'))}>
					<ActionBody label={t('default-prompt.latest-coins')} className="justify-center p-5" />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.smart-wallet-recommendations'))}>
					<ActionBody label={t('default-prompt.smart-wallet-recommendations')} className="justify-center p-5" />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.largest-whales'))}>
					<ActionBody label={t('default-prompt.largest-whales')} className="justify-center p-5" />
				</ActionCard>
				<ActionCard onPress={() => handleAction(t('default-prompt.info-about', { item: 'XX' }))}>
					<ActionBody label={t('default-prompt.info-about', { item: currentCoin })} className="justify-center p-5" />
				</ActionCard>
			</div>
		</section>
	);
};

export default memo(DefaultPrompt, (prev, next) => {
	return prev.currentCoin === next.currentCoin;
});
