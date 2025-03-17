import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { useFormRules } from '@/libs/form/hooks/useFormRules';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';

import { Address } from '../enums/address.enum';
import { Order } from '../enums/order.enum';

export const filterFormSchemaPrimitive = z.object({
	[FilterColumn.Address]: z.array(z.nativeEnum(Address)),
	[FilterColumn.Order]: z.array(z.nativeEnum(Order)),
	[FilterColumn.TransactionMin]: z.number().nullable(),
	[FilterColumn.TransactionMax]: z.number().nullable(),
	[FilterColumn.OrderCountMin]: z.number().nullable(),
	[FilterColumn.OrderCountMax]: z.number().nullable(),
});

export const useFilterFormSchema = () => {
	const { messages, patterns } = useFormRules();
	const tvlPattern = useTranslations('validation.pattern');
	const tokenRanking = useTranslations('token.ranking');

	return z
		.object({
			[FilterColumn.Address]: z
				.array(z.nativeEnum(Address, { message: messages.primitive.invalid_type_error }))
				.nullable(),
			[FilterColumn.Order]: z.array(z.nativeEnum(Order, { message: messages.primitive.invalid_type_error })).nullable(),
			[FilterColumn.TransactionMin]: patterns.moreThenZeroNumber.nullable(),
			[FilterColumn.TransactionMax]: patterns.moreThenZeroNumber.nullable(),
			[FilterColumn.OrderCountMin]: patterns.moreThenZeroNumber.nullable(),
			[FilterColumn.OrderCountMax]: patterns.moreThenZeroNumber.nullable(),
		})
		.refine(
			data => {
				const tmin = data[FilterColumn.TransactionMin];
				const tmax = data[FilterColumn.TransactionMax];

				if (tmin === null || tmax === null) {
					return true;
				}

				return tmin < tmax;
			},
			{
				message: tvlPattern('more-than-min', {
					min: tokenRanking('filter.transaction-title'),
				}),
			},
		)
		.refine(
			data => {
				const ocmin = data[FilterColumn.OrderCountMin];
				const ocmax = data[FilterColumn.OrderCountMax];

				if (ocmin === null || ocmax === null) {
					return true;
				}

				return ocmin < ocmax;
			},
			{
				message: tvlPattern('more-than-min', {
					min: tokenRanking('filter.order-title'),
				}),
			},
		);
};

export const DEFAULT_FILTER_FORM_DATA: FilterFormData = {
	[FilterColumn.Address]: null,
	[FilterColumn.Order]: null,
	[FilterColumn.TransactionMin]: null,
	[FilterColumn.TransactionMax]: null,
	[FilterColumn.OrderCountMin]: null,
	[FilterColumn.OrderCountMax]: null,
};

export type FilterFormData = z.infer<ReturnType<typeof useFilterFormSchema>>;
