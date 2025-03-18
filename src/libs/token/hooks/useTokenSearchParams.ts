import 'client-only';
import { useQueryStates, parseAsStringEnum, parseAsBoolean, parseAsArrayOf, parseAsFloat } from 'nuqs';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';

import { Address } from '../enums/address.enum';
import { IntervalFilter } from '../enums/interval-filter.enum';
import { Order } from '../enums/order.enum';

export const tokenQueryStates = {
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMinute),
	[FilterColumn.Address]: parseAsArrayOf(parseAsStringEnum(Object.values(Address))).withDefault([
		Address.SmartMoney,
		Address.Whale,
	]),
	[FilterColumn.Order]: parseAsArrayOf(parseAsStringEnum(Object.values(Order))).withDefault([Order.KOL]),
	[FilterColumn.TransactionMin]: parseAsFloat,
	[FilterColumn.TransactionMax]: parseAsFloat,
	[FilterColumn.OrderCountMin]: parseAsFloat,
	[FilterColumn.OrderCountMax]: parseAsFloat,
};

export const useTokenSearchParams = () => {
	const [searchParams, setSearchParams] = useQueryStates(tokenQueryStates);

	return [searchParams, setSearchParams] as const;
};
