import { createLoader, parseAsBoolean } from 'nuqs/server';
import 'server-only';

export const globalQueryState = {
	debug: parseAsBoolean.withDefault(false),
	mock: parseAsBoolean.withDefault(false),
};

export const loadGlobalSearchParams = createLoader(globalQueryState);
