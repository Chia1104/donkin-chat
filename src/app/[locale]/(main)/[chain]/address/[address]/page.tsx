import { captureException } from '@sentry/nextjs';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Detail from '@/containers/address/detail';
import { getAddress } from '@/libs/address/resources/address.resource.rsc';
import { loadAddressSearchParams } from '@/libs/address/services/loadAddressSearchParams';
import { loadGlobalSearchParams } from '@/services/loadGlobalSearchParams';
import { IS_DEV } from '@/utils/env';
import { truncateMiddle } from '@/utils/format';
import { logger } from '@/utils/logger';
import { getQueryClient } from '@/utils/query-client';

export async function generateMetadata(props: PagePropsWithLocale<{ address: string }>): Promise<Metadata> {
	const [{ address }, tRoutes, tWallet] = await Promise.all([
		props.params,
		getTranslations('routes'),
		getTranslations('address.not-found'),
	]);
	try {
		return {
			title: `${truncateMiddle(address, 10)} | ${tRoutes('wallet.title')}`,
		};
	} catch (error) {
		logger(error, { type: 'error' });
		return {
			title: tWallet('title'),
		};
	}
}

const Page = async (props: PagePropsWithLocale<{ address: string }>) => {
	const queryClient = getQueryClient();

	const [{ address }, searchParams, addressSearchParams] = await Promise.all([
		props.params,
		loadGlobalSearchParams(props.searchParams),
		loadAddressSearchParams(props.searchParams),
	]);

	try {
		if (!searchParams.disableSSR) {
			await queryClient.fetchQuery({
				queryKey: ['address', address, addressSearchParams.interval],
				queryFn: () =>
					getAddress(address, {
						data: {
							interval: addressSearchParams.interval,
						},
						timeout: 60_000,
					}),
			});
		}
	} catch (error) {
		logger(error, { type: 'error', enabled: typeof window === 'undefined' });
		if (!(error instanceof HTTPError)) {
			captureException(error);
		}
		if (!IS_DEV && !searchParams.debug) {
			notFound();
		}
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Detail />
		</HydrationBoundary>
	);
};

export default Page;
