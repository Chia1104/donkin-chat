import { parseAsBoolean, parseAsStringEnum, createLoader } from 'nuqs/server';
import 'server only';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { TotalFilter } from '@/libs/token/enums/total-filter.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';

export const tokenQueryStates = {
	[FilterColumn.Total]: parseAsStringEnum(Object.values(TotalFilter)),
	[FilterColumn.Transactions]: parseAsStringEnum(Object.values(TransactionsFilter)),
	[FilterColumn.Favorite]: parseAsBoolean,
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneDay),
};

export const loadTokenSearchParams = createLoader(tokenQueryStates);
