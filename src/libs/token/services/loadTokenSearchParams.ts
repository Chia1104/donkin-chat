import { createLoader, parseAsStringEnum, parseAsBoolean, parseAsArrayOf, parseAsFloat } from 'nuqs/server';
import 'server only';

import { FilterColumn } from '@/libs/token/enums/filter-column.enum';

import { Address } from '../enums/address.enum';
import { IntervalFilter } from '../enums/interval-filter.enum';
import { Order } from '../enums/order.enum';

export const tokenQueryStates = {
	[FilterColumn.Mark]: parseAsBoolean.withDefault(true),
	[FilterColumn.Interval]: parseAsStringEnum(Object.values(IntervalFilter)).withDefault(IntervalFilter.OneMinute),
	[FilterColumn.Address]: parseAsArrayOf(parseAsStringEnum(Object.values(Address))),
	[FilterColumn.Order]: parseAsArrayOf(parseAsStringEnum(Object.values(Order))),
	[FilterColumn.TransactionMin]: parseAsFloat,
	[FilterColumn.TransactionMax]: parseAsFloat,
	[FilterColumn.OrderCountMin]: parseAsFloat,
	[FilterColumn.OrderCountMax]: parseAsFloat,
};

export const loadTokenSearchParams = createLoader(tokenQueryStates);
