import { useQueryStates, parseAsStringEnum, parseAsString } from 'nuqs';

import { QueryType } from '@/enums/queryType.enum';

export const aiQueryStates = {
	q: parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.AiSignal),
	threadId: parseAsString.withDefault(crypto.randomUUID()),
};

export const useAISearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(aiQueryStates);

	return [searchParams, setSearchParams] as const;
};
