import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import SuperJSON from 'superjson';

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				retry: false,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
			},
			dehydrate: {
				serializeData: SuperJSON.serialize,
				shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize,
			},
		},
	});

let clientQueryClientSingleton: QueryClient | undefined = undefined;

export const getQueryClient = () => {
	if (typeof window === 'undefined') {
		// Server: always make a new query client
		return createQueryClient();
	} else {
		// Browser: use singleton pattern to keep the same query client
		return (clientQueryClientSingleton ??= createQueryClient());
	}
};
