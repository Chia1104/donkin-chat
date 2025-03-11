import { createLoader, parseAsStringEnum, parseAsString } from 'nuqs/server';

import { QueryType } from '@/libs/ai/enums/queryType.enum';

export const aiQueryStates = {
	q: parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.Tokens),
	threadId: parseAsString.withDefault(crypto.randomUUID()),
};

export const loadAISearchParams = createLoader(aiQueryStates);
