import 'client-only';
import { useQueryStates, parseAsStringEnum, parseAsBoolean, parseAsJson } from 'nuqs';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';

import { IntervalFilter } from '../enums/interval-filter.enum';
import { filterFormSchemaPrimitive } from './useFilterFormSchema';

export const tokenQueryStates = {
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMinute),
	// eslint-disable-next-line @typescript-eslint/unbound-method
	[FilterColumn.Filter]: parseAsJson(filterFormSchemaPrimitive.parse),
};

export const useTokenSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(tokenQueryStates);

	return [searchParams, setSearchParams] as const;
};
