import { z } from 'zod';

import { useFormRules } from '@/libs/form/hooks/useFormRules';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { TotalFilter } from '@/libs/token/enums/total-filter.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';

export const useFilterFormSchema = () => {
	const { messages } = useFormRules();

	return z.object({
		[FilterColumn.Total]: z.nativeEnum(TotalFilter, { message: messages.primitive.invalid_type_error }).nullable(),
		[FilterColumn.Transactions]: z
			.nativeEnum(TransactionsFilter, { message: messages.primitive.invalid_type_error })
			.nullable(),
		[FilterColumn.Favorite]: z.boolean({ message: messages.primitive.invalid_type_error }).nullable(),
	});
};

export const DEFAULT_FILTER_FORM_DATA: FilterFormData = {
	[FilterColumn.Total]: null,
	[FilterColumn.Transactions]: null,
	[FilterColumn.Favorite]: null,
};

export type FilterFormData = z.infer<ReturnType<typeof useFilterFormSchema>>;
