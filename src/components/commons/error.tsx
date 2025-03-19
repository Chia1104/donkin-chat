'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { useTranslations } from 'next-intl';

import { IS_PRODUCTION } from '@/utils/env';

interface Props<TError extends Error> {
	error: TError;
	fallback?: React.ReactNode;
}

export const Error = <TError extends Error>({ error, fallback }: Props<TError>) => {
	const t = useTranslations('commons.error');

	return (
		fallback ?? (
			<div className="w-full rounded-medium flex flex-col gap-4 bg-danger-100/50 border border-danger-100 text-foreground p-5">
				<h2 className="text-lg font-medium">{t('title')}</h2>
				<p className="text-sm text-default-500">{t('description')}</p>
				{!IS_PRODUCTION && (
					<Accordion variant="bordered">
						<AccordionItem title="Details" aria-label={t('title')}>
							{error.message}
						</AccordionItem>
					</Accordion>
				)}
			</div>
		)
	);
};
