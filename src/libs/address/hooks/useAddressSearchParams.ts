import 'client-only';
import { useQueryStates, parseAsStringEnum, parseAsArrayOf } from 'nuqs';

import { DisplayFilter } from '@/libs/address/enums/display-filter.enum';
import { FilterColumn } from '@/libs/address/enums/filter-column.enum';
import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';

export const addressQueryStates = {
	[FilterColumn.Display]: parseAsArrayOf(parseAsStringEnum(Object.values(DisplayFilter))).withDefault([
		DisplayFilter.BalanceHistory,
		DisplayFilter.ProfitLoss,
	]),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMonth),
};

export const useAddressSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(addressQueryStates);

	return [searchParams, setSearchParams] as const;
};
