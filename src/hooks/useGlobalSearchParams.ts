import 'client-only';
import { parseAsBoolean, useQueryStates } from 'nuqs';

export const globalQueryState = {
	debug: parseAsBoolean.withDefault(false),
	mock: parseAsBoolean.withDefault(false),
};

export const useGlobalSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(globalQueryState);

	return [searchParams, setSearchParams] as const;
};
