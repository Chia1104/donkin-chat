import { useQueryState, parseAsStringEnum } from 'nuqs';

import { QueryType } from '@/enums/queryType.enum';

export const useQueryType = () => {
	const [q, setQ] = useQueryState('q', parseAsStringEnum(Object.values(QueryType)));

	return [q, setQ] as const;
};
