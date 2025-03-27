import { createLoader, parseAsBoolean } from 'nuqs/server';

export const globalQueryState = {
	debug: parseAsBoolean.withDefault(false),
};

export const loadGlobalSearchParams = createLoader(globalQueryState);
