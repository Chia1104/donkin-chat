import { parseAsBoolean, parseAsStringEnum, createLoader, parseAsJson } from 'nuqs/server';
import 'server only';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';

import { filterFormSchemaPrimitive } from '../hooks/useFilterFormSchema';

export const tokenQueryStates = {
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMinute),
	// eslint-disable-next-line @typescript-eslint/unbound-method
	[FilterColumn.Filter]: parseAsJson(filterFormSchemaPrimitive.parse),
};

export const loadTokenSearchParams = createLoader(tokenQueryStates);
