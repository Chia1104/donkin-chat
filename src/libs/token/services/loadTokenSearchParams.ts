import { parseAsBoolean, parseAsStringEnum, createLoader, parseAsJson, parseAsNumberLiteral } from 'nuqs/server';
import 'server only';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { TransactionsLiteral } from '@/libs/token/enums/transactions-filter.enum';

import { Filter } from '../enums/filter-filter.enum';
import { ProfitLiteral } from '../enums/profit-filter.enum';
import { filterFormSchemaPrimitive } from '../hooks/useFilterFormSchema';

export const tokenQueryStates = {
	[FilterColumn.Transactions]: parseAsNumberLiteral(TransactionsLiteral),
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneDay),
	[FilterColumn.Filter]: parseAsStringEnum(Object.values(Filter)),
	// eslint-disable-next-line @typescript-eslint/unbound-method
	[FilterColumn.Type]: parseAsJson(filterFormSchemaPrimitive.shape[FilterColumn.Type].parse),
	[FilterColumn.Profit]: parseAsNumberLiteral(ProfitLiteral),
};

export const loadTokenSearchParams = createLoader(tokenQueryStates);
