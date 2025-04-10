import { captureException } from '@sentry/nextjs';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Detail from '@/containers/address/detail';
import { getAddress } from '@/libs/address/resources/address.resource';
import { loadAddressSearchParams } from '@/libs/address/services/loadAddressSearchParams';
import { loadGlobalSearchParams } from '@/services/loadGlobalSearchParams';
import { IS_DEV } from '@/utils/env';
import { logger } from '@/utils/logger';
import { getQueryClient } from '@/utils/query-client';

export async function generateMetadata(): Promise<Metadata> {
	const tRoutes = await getTranslations('routes');
	return {
		title: tRoutes('wallet.title'),
	};
}

const Page = async (props: PagePropsWithLocale<{ address: string }>) => {
	const queryClient = getQueryClient();

	const [{ address }, searchParams, addressSearchParams] = await Promise.all([
		props.params,
		loadGlobalSearchParams(props.searchParams),
		loadAddressSearchParams(props.searchParams),
	]);

	try {
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
