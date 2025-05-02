'use client';

import { useTranslations } from 'next-intl';
import { Helmet } from 'react-helmet-async';

export const Head = (props: { children?: React.ReactNode; title?: string }) => {
	const tMeta = useTranslations('meta');
	return (
		<Helmet>
			{props.title && (
				<title>
					{props.title} | {tMeta('title')}
				</title>
			)}
			{props.children}
		</Helmet>
	);
};
