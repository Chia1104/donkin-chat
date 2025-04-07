import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import Detail from '@/containers/address/detail';
import { getAddress } from '@/libs/address/resources/address.resource';
import { loadAddressSearchParams } from '@/libs/address/services/loadAddressSearchParams';
import { loadGlobalSearchParams } from '@/services/loadGlobalSearchParams';
import { IS_DEV } from '@/utils/env';
import { getQueryClient } from '@/utils/query-client';

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
				}),
		});
	} catch {
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
