'use client';

import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { useTranslations } from 'next-intl';

import { withError } from '@/hocs/with-error';

const Error = withError(({ reset }) => {
	const tCommon = useTranslations('commons');
	const tToken = useTranslations('token');
	const tAction = useTranslations('action');

	return (
		<div className="flex flex-col items-center justify-center w-full p-4 text-center">
			<Image
				removeWrapper
				src="/assets/images/donkin.png"
				width={50}
				height={50}
				alt={tCommon('error.title')}
				className="mb-8"
			/>
			<h1 className="text-3xl font-bold mb-4">{tCommon('error.title')}</h1>
			<p className="text-gray-500 mb-8 max-w-md">{tToken('not-found.description')}</p>
			<div className="flex gap-4">
				<Button variant="bordered" onPress={() => reset()} aria-label={tAction('back-to-previous')}>
					{tCommon('error.retry')}
				</Button>
			</div>
		</div>
	);
});

export default Error;
