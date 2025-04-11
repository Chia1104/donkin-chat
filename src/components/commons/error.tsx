'use client';

import { useEffect } from 'react';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';

import { useGlobalSearchParams } from '@/hooks/useGlobalSearchParams';
import { IS_PRODUCTION } from '@/utils/env';

interface Props<TError extends Error> {
	error?: TError | null;
	fallback?: React.ReactNode;
	onRetry?: () => void;
	enabledSentry?: boolean;
}

export const Error = <TError extends Error>({ error, fallback, onRetry, enabledSentry = false }: Props<TError>) => {
	const t = useTranslations('commons.error');
	const [searchParams] = useGlobalSearchParams();

	useEffect(() => {
		if (enabledSentry && error) {
			captureException(error);
		}
	}, [error, enabledSentry]);

	return (
		fallback ?? (
			<div className="w-full rounded-medium flex flex-col gap-4 bg-danger-100/50 border border-danger-100 text-foreground p-5">
				<h2 className="text-lg font-medium">{t('title')}</h2>
				<p className="text-sm text-default-500">{t('description')}</p>
				{onRetry && (
					<Button variant="flat" color="danger" onPress={onRetry}>
						{t('retry')}
					</Button>
				)}
				{(!IS_PRODUCTION || searchParams.debug) && (
					<Accordion variant="bordered">
						<AccordionItem title="Details" aria-label={t('title')}>
							{error?.message}
						</AccordionItem>
					</Accordion>
				)}
			</div>
		)
	);
};
