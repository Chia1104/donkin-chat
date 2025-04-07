'use client';

import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';

const NotFound = () => {
	const router = useTransitionRouter();
	const tCommon = useTranslations('commons');
	const tAddress = useTranslations('address');
	const tAction = useTranslations('action');

	return (
		<div className="flex flex-col items-center justify-center w-full p-4 text-center">
			<Image
				removeWrapper
				src="/assets/images/donkin.png"
				width={50}
				height={50}
				alt={tCommon('not-found.title')}
				className="mb-8"
			/>
			<h1 className="text-3xl font-bold mb-4">{tAddress('not-found.title')}</h1>
			<p className="text-gray-500 mb-8 max-w-md">{tAddress('not-found.description')}</p>
			<div className="flex gap-4">
				<Button variant="bordered" onPress={() => router.back()} aria-label={tAction('back-to-previous')}>
					{tAction('back-to-previous')}
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
