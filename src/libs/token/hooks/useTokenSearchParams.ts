import 'client-only';
import { useQueryStates, parseAsStringEnum, parseAsBoolean } from 'nuqs';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { TotalFilter } from '@/libs/token/enums/total-filter.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';

import { IntervalFilter } from '../enums/interval-filter.enum';

export const tokenQueryStates = {
	[FilterColumn.Total]: parseAsStringEnum(Object.values(TotalFilter)),
	[FilterColumn.Transactions]: parseAsStringEnum(Object.values(TransactionsFilter)),
	[FilterColumn.Favorite]: parseAsBoolean,
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneDay),
};

export const useTokenSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(tokenQueryStates);

	return [searchParams, setSearchParams] as const;
};
