import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import Detail from '@/containers/token/detail';
import { getToken } from '@/libs/token/resources/token.resource';
import { getQueryClient } from '@/utils/query-client';

const Page = async ({ params }: { params: PageParamsWithLocale<{ token: string }> }) => {
	const queryClient = getQueryClient();

	const { token } = await params;

	try {
		await queryClient.fetchQuery({
			queryKey: ['token', token],
			queryFn: () => getToken(token),
		});
	} catch {
		notFound();
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Detail />
		</HydrationBoundary>
	);
};

export default Page;
