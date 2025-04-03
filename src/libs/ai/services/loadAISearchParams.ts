import { createLoader, parseAsStringEnum, parseAsString } from 'nuqs/server';

import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { Sort } from '@/libs/ai/enums/sort.enum';
import { TokenSort } from '@/libs/ai/enums/tokenSort.enum';
import { uuid } from '@/utils/uuid';

export const aiQueryStates = {
	q: parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.Tokens),
	threadId: parseAsString.withDefault(uuid()),
	sort: parseAsStringEnum(Object.values(TokenSort)).withDefault(TokenSort.MarketCap),
	order: parseAsStringEnum(Object.values(Sort)).withDefault(Sort.Desc),
};

export const loadAISearchParams = createLoader(aiQueryStates);
