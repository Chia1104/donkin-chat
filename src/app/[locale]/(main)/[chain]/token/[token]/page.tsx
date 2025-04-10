import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Detail from '@/containers/token/detail';
import { getToken } from '@/libs/token/resources/token.resource';
import { loadGlobalSearchParams } from '@/services/loadGlobalSearchParams';
import { IS_DEV } from '@/utils/env';
import { getQueryClient } from '@/utils/query-client';

export async function generateMetadata(): Promise<Metadata> {
	const tRoutes = await getTranslations('routes');
	return {
		title: tRoutes('token.title'),
	};
}

const Page = async (props: PagePropsWithLocale<{ token: string }>) => {
	const queryClient = getQueryClient();

	const { token } = await props.params;
	const searchParams = await loadGlobalSearchParams(props.searchParams);

	try {
		await queryClient.fetchQuery({
			queryKey: ['token', token],
			queryFn: () => getToken(token),
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
