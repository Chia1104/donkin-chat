import { useQueryState, parseAsStringEnum } from 'nuqs';

import { QueryType } from '@/libs/ai/enums/queryType.enum';

/**
 * @deprecated Use `useAISearchParams` instead.
 */
export const useQueryType = () => {
	const [q, setQ] = useQueryState('q', parseAsStringEnum(Object.values(QueryType)).withDefault(QueryType.AiSignal));

	return [q, setQ] as const;
};
