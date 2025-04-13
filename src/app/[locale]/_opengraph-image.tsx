import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

import OpenGraph from '@/components/commons/open-graph';

export const alt = 'Donkin';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export default async function og() {
	const t = await getTranslations('meta');
	return new ImageResponse(
		(
			<OpenGraph
				metadata={{
					title: t('title'),
					excerpt: t('description'),
				}}
				styles={{
					title: {
						color: 'transparent',
					},
				}}
			/>
		),
		{
			...size,
			status: 200,
		},
	);
}
