import { z } from 'zod';

import { useFormRules } from '@/libs/form/hooks/useFormRules';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';

import { Filter } from '../enums/filter-filter.enum';
import { ProfitFilter } from '../enums/profit-filter.enum';
import { TypeFilter } from '../enums/type-filter.enum';

export const filterFormSchemaPrimitive = z.object({
	[FilterColumn.Filter]: z.nativeEnum(Filter).nullable(),
	[FilterColumn.Type]: z.array(z.nativeEnum(TypeFilter)),
	[FilterColumn.Transactions]: z.nativeEnum(TransactionsFilter).nullable(),
	[FilterColumn.Profit]: z.nativeEnum(ProfitFilter).nullable(),
});

export const useFilterFormSchema = () => {
	const { messages } = useFormRules();

	return z.object({
		[FilterColumn.Filter]: z.nativeEnum(Filter, { message: messages.primitive.invalid_type_error }).nullable(),
		[FilterColumn.Type]: z
			.array(z.nativeEnum(TypeFilter, { message: messages.primitive.invalid_type_error }))
			.nullable(),
		[FilterColumn.Transactions]: z
			.nativeEnum(TransactionsFilter, { message: messages.primitive.invalid_type_error })
			.nullable(),
		[FilterColumn.Profit]: z.nativeEnum(ProfitFilter, { message: messages.primitive.invalid_type_error }).nullable(),
	});
};

export const DEFAULT_FILTER_FORM_DATA: FilterFormData = {
	[FilterColumn.Filter]: null,
	[FilterColumn.Type]: [],
	[FilterColumn.Transactions]: null,
	[FilterColumn.Profit]: null,
};

export type FilterFormData = z.infer<ReturnType<typeof useFilterFormSchema>>;
