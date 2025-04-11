import { createLoader, parseAsStringEnum, parseAsString } from 'nuqs/server';

import { DEFAULT_THREAD_ID } from '@/libs/ai/constants';
import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { Sort } from '@/libs/ai/enums/sort.enum';
import { TokenSort } from '@/libs/ai/enums/tokenSort.enum';

export const aiQueryStates = {
	q: parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.Heatmap),
	threadId: parseAsString.withDefault(DEFAULT_THREAD_ID),
	sort: parseAsStringEnum(Object.values(TokenSort)).withDefault(TokenSort.MarketCap),
	order: parseAsStringEnum(Object.values(Sort)).withDefault(Sort.Desc),
};

export const loadAISearchParams = createLoader(aiQueryStates);
