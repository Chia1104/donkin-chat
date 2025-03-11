import { useQueryStates, parseAsStringEnum, parseAsString } from 'nuqs';

import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { TokenSort } from '@/libs/ai/enums/tokenSort.enum';

export const aiQueryStates = {
	q: parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.Tokens),
	threadId: parseAsString.withDefault(crypto.randomUUID()),
	sort: parseAsStringEnum(Object.values(TokenSort)).withDefault(TokenSort.Hot),
};

export const useAISearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(aiQueryStates);

	return [searchParams, setSearchParams] as const;
};
