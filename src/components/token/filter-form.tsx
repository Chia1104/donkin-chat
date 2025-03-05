'use client';

import { Button } from '@heroui/button';
import { CheckboxGroup, Checkbox } from '@heroui/checkbox';
import { RadioGroup, Radio } from '@heroui/radio';
import { Slider } from '@heroui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormItem, FormLabel, FormField } from '@/components/ui/form';
import SubmitForm from '@/components/ui/submit-form';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { Filter } from '@/libs/token/enums/filter-filter.enum';
import { ProfitFilter } from '@/libs/token/enums/profit-filter.enum';
import { TransactionsFilter } from '@/libs/token/enums/transactions-filter.enum';
import { TypeFilter } from '@/libs/token/enums/type-filter.enum';
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
			<form onSubmit={onSubmit} className="w-full">
				<div className="p-2 flex flex-col gap-4 w-full items-start">
					<FormField<FilterFormData, typeof FilterColumn.Filter>
						control={form.control}
						name={FilterColumn.Filter}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className='className="text-small font-bold'>篩選顯示</FormLabel>
								<FormControl className="w-full">
									<RadioGroup
										aria-label="filter"
										defaultValue={field.value}
										onValueChange={field.onChange}
										orientation="horizontal"
										classNames={{
											wrapper: 'w-full flex-nowrap',
										}}
									>
										<Radio
											size="sm"
											value={Filter.Recommend}
											classNames={{
												base: 'rounded-lg max-w-1/2 m-0 border-1 border-divider w-1/2',
												label: 'text-xs',
											}}
										>
											推荐
										</Radio>
										<Radio
											size="sm"
											value={Filter.Manual}
											classNames={{
												base: 'rounded-lg max-w-1/2 m-0 border-1 border-divider w-1/2',
												label: 'text-xs',
											}}
										>
											自选
										</Radio>
									</RadioGroup>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField<FilterFormData, typeof FilterColumn.Type>
						control={form.control}
						name={FilterColumn.Type}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className='className="text-small font-bold'>聪明钱類型</FormLabel>
								<FormControl className="w-full">
									<CheckboxGroup
										className="w-full"
										classNames={{
											wrapper: 'w-full',
										}}
										aria-label="type"
										value={field.value ?? []}
										onChange={field.onChange}
									>
										<Checkbox
											classNames={{
												base: 'border-1 border-divider rounded-lg m-0 max-w-full',
											}}
											size="sm"
											value={TypeFilter.SmartMoney}
										>
											聰明錢
										</Checkbox>
										<Checkbox
											classNames={{
												base: 'border-1 border-divider rounded-lg m-0 max-w-full',
											}}
											size="sm"
											value={TypeFilter.Whale}
										>
											巨鲸
										</Checkbox>
										<Checkbox
											classNames={{
												base: 'border-1 border-divider rounded-lg m-0 max-w-full',
											}}
											size="sm"
											value={TypeFilter.Kol}
										>
											KOL
										</Checkbox>
									</CheckboxGroup>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField<FilterFormData, typeof FilterColumn.Transactions>
						control={form.control}
						name={FilterColumn.Transactions}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className='className="text-small font-bold'>交易金额</FormLabel>
								<FormControl>
									<Slider
										className="max-w-full"
										color="foreground"
										defaultValue={field.value ?? 0}
										maxValue={TransactionsFilter['100K']}
										minValue={TransactionsFilter['5K']}
										showSteps
										size="sm"
										step={2.5}
										classNames={{
											thumb: 'border-2 border-primary bg-content1 w-4 h-4',
											step: 'bg-content1 data-[in-range=true]:bg-content1 data-[in-range=true]:border-primary data-[in-range=false]:border-divider border-1 w-2 h-2 bg-content1',
											track: 'border-s-primary',
											filler: 'bg-primary',
										}}
										onChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField<FilterFormData, typeof FilterColumn.Profit>
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-full my-2">
								<FormLabel className='className="text-small font-bold'>利潤</FormLabel>
								<FormControl>
									<Slider
										className="max-w-full"
										color="foreground"
										defaultValue={field.value ?? 0}
										maxValue={ProfitFilter['100%']}
										minValue={ProfitFilter['5%']}
										showSteps
										size="sm"
										step={2.5}
										classNames={{
											thumb: 'border-2 border-primary bg-content1 w-4 h-4',
											step: 'bg-content1 data-[in-range=true]:bg-content1 data-[in-range=true]:border-primary data-[in-range=false]:border-divider border-1 w-2 h-2 bg-content1',
											track: 'border-s-primary',
											filler: 'bg-primary',
										}}
										onChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
						name={FilterColumn.Profit}
					/>
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
