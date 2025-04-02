'use client';

import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
import { useTranslations } from 'next-intl';

import { useGlobalStore } from '@/stores/global/store';

const OnboardingTooltip = () => {
	const onboarding = useGlobalStore(state => state.completeDonkin);
	const action = useGlobalStore(state => state.toggleDonkin);
	const t = useTranslations('onboarding.donkin');
	const tAction = useTranslations('action');

	const handleOpen = () => {
		action(true);
		onboarding();
	};
	const handleClose = () => {
		onboarding();
	};
	return (
		<Card className="bg-[rgba(28,_38,_51,_0.98)] p-4 max-w-[312px]">
			<CardHeader className="text-primary text-xs font-normal gap-2">
				<Image src="/assets/images/sparkless.svg" alt="sparkle" className="w-4 h-4" />
				{t('title')}
			</CardHeader>
			<CardBody className="flex flex-col gap-3">
				<p className="text-description text-xs font-light">{t('description')}</p>
				<Button size="sm" className="w-fit" onPress={() => handleOpen()}>
					{t('button.hot-tokens')}
				</Button>
				<Button size="sm" className="w-fit" onPress={() => handleOpen()}>
					{t('button.smart-wallets')}
				</Button>
				<Button size="sm" className="w-fit" onPress={() => handleOpen()}>
					{t('button.whale-addresses')}
				</Button>
			</CardBody>
			<CardFooter className="flex flex-row justify-end">
				<Button variant="light" size="sm" onPress={() => handleClose()} className="p-1">
					{tAction('skip')}
				</Button>
				<Button size="sm" color="primary" variant="light" onPress={() => handleOpen()} className="p-1">
					{tAction('experience')}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default OnboardingTooltip;
