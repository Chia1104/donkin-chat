import 'client-only';
import { useQueryStates, parseAsStringEnum, parseAsBoolean, parseAsJson, parseAsNumberLiteral } from 'nuqs';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { TransactionsLiteral } from '@/libs/token/enums/transactions-filter.enum';

import { Filter } from '../enums/filter-filter.enum';
import { IntervalFilter } from '../enums/interval-filter.enum';
import { ProfitLiteral } from '../enums/profit-filter.enum';
import { filterFormSchemaPrimitive } from './useFilterFormSchema';

export const tokenQueryStates = {
	[FilterColumn.Transactions]: parseAsNumberLiteral(TransactionsLiteral),
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMinute),
	[FilterColumn.Filter]: parseAsStringEnum(Object.values(Filter)),
	// eslint-disable-next-line @typescript-eslint/unbound-method
	[FilterColumn.Type]: parseAsJson(filterFormSchemaPrimitive.shape[FilterColumn.Type].parse),
	[FilterColumn.Profit]: parseAsNumberLiteral(ProfitLiteral),
};

export const useTokenSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(tokenQueryStates);

	return [searchParams, setSearchParams] as const;
};
