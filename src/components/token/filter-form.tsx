'use client';

import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Divider } from '@heroui/divider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormItem, FormLabel, FormField } from '@/components/ui/form';
import SubmitForm from '@/components/ui/submit-form';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { TotalFilter } from '@/libs/token/enums/total-filter.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';
import type { FilterFormData } from '@/libs/token/hooks/useFilterFormSchema';
import { DEFAULT_FILTER_FORM_DATA } from '@/libs/token/hooks/useFilterFormSchema';
import { useFilterFormSchema } from '@/libs/token/hooks/useFilterFormSchema';

interface Props {
	defaultValues?: FilterFormData;
	onSubmit?: (data: FilterFormData) => void;
	onReset?: () => void;
}

const FilterForm = (props: Props) => {
	const t = useTranslations('token');
	const tAction = useTranslations('action');
	const schema = useFilterFormSchema();
	const form = useForm<FilterFormData>({
		defaultValues: props.defaultValues,
		resolver: zodResolver(schema),
	});

	const onSubmit = form.handleSubmit(data => {
		if (props.onSubmit) {
			props.onSubmit(data);
		}
	});

	const handleReset = () => {
		form.reset(DEFAULT_FILTER_FORM_DATA);
		if (props.onReset) {
			props.onReset();
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<div className="p-2 flex flex-col gap-3 w-full items-start">
					<FormField<FilterFormData, typeof FilterColumn.Total>
						control={form.control}
						name={FilterColumn.Total}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<div className="text-small font-bold">{t('ranking.filter.total-title')}</div>
								</FormLabel>
								<FormControl>
									<ul className="flex flex-wrap gap-2 w-full">
										<li className="w-full">
											<Button
												area-label="> 5,000"
												fullWidth
												variant={field.value === TotalFilter.MoreThan5000 ? 'solid' : 'ghost'}
												size="sm"
												className="border-1"
												onPress={() => field.onChange(TotalFilter.MoreThan5000)}
											>
												{t('ranking.filter.total-5k')}
											</Button>
										</li>
										<li className="w-full">
											<Button
												area-label="> 10k"
												fullWidth
												variant={field.value === TotalFilter.MoreThan10K ? 'solid' : 'ghost'}
												size="sm"
												className="border-1"
												onPress={() => field.onChange(TotalFilter.MoreThan10K)}
											>
												{t('ranking.filter.total-10k')}
											</Button>
										</li>
										<li className="w-full">
											<Button
												area-label="> 50k"
												fullWidth
												variant={field.value === TotalFilter.MoreThan50K ? 'solid' : 'ghost'}
												size="sm"
												className="border-1"
												onPress={() => field.onChange(TotalFilter.MoreThan50K)}
											>
												{t('ranking.filter.total-50k')}
											</Button>
										</li>
									</ul>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField<FilterFormData, typeof FilterColumn.Transactions>
						control={form.control}
						name={FilterColumn.Transactions}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									<div className="text-small font-bold">
										{t('ranking.filter.transaction-title-by-day', { day: '7D' })}
									</div>
								</FormLabel>
								<FormControl>
									<ul className="flex flex-wrap gap-2 w-full">
										<li className="w-full">
											<Button
												area-label="0 - 100"
												fullWidth
												variant={field.value === TransactionsFilter.LessThan100 ? 'solid' : 'ghost'}
												size="sm"
												className="border-1"
												onPress={() => field.onChange(TransactionsFilter.LessThan100)}
											>
												{t('ranking.filter.transaction-less-100')}
											</Button>
										</li>
										<li className="w-full">
											<Button
												area-label="> 100"
												fullWidth
												variant={field.value === TransactionsFilter.MoreThan100 ? 'solid' : 'ghost'}
												size="sm"
												className="border-1"
												onPress={() => field.onChange(TransactionsFilter.MoreThan100)}
											>
												{t('ranking.filter.transaction-more-100')}
											</Button>
										</li>
									</ul>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField<FilterFormData, typeof FilterColumn.Favorite>
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-full my-2">
								<FormControl>
									<Checkbox
										radius="sm"
										size="sm"
										classNames={{
											base: 'flex-row-reverse justify-between min-w-full max-w-full m-0 p-0',
											wrapper: 'm-0 before:border-1',
										}}
										area-label={t('ranking.filter.favorite-only')}
										isSelected={!!field.value}
										onValueChange={e => field.onChange(e)}
									>
										{t('ranking.filter.favorite-only')}
									</Checkbox>
								</FormControl>
							</FormItem>
						)}
						name={FilterColumn.Favorite}
					/>
					<Divider className="w-[calc(100%+48px)] -mx-6" />
					<div className="flex gap-2 w-full justify-between">
						<Button
							area-label={tAction('reset')}
							variant="ghost"
							size="sm"
							fullWidth
							className="border-1"
							onPress={() => handleReset()}
						>
							{tAction('reset')}
						</Button>
						<SubmitForm area-label={tAction('active')} variant="solid" color="primary" size="sm" fullWidth>
							{tAction('active')}
						</SubmitForm>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default FilterForm;
