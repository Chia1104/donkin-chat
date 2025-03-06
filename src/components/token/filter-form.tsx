'use client';

import { useMemo } from 'react';

import { CheckboxGroup, Checkbox } from '@heroui/checkbox';
import { RadioGroup, Radio } from '@heroui/radio';
import { Slider } from '@heroui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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

import { HeroButton as Button } from '../ui/hero-button';

interface Props {
	defaultValues?: FilterFormData;
	onSubmit?: (data: FilterFormData) => void;
	onReset?: () => void;
	onTransactionsClear?: () => void;
	onProfitClear?: () => void;
}

const FilterForm = (props: Props) => {
	const t = useTranslations('token');
	const tAction = useTranslations('action');
	const tUtils = useTranslations('utils');
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

	const handleClearTransactions = () => {
		form.setValue('transactions', null);
		if (props.onTransactionsClear) {
			props.onTransactionsClear();
		}
	};

	const handleClearProfit = () => {
		form.setValue('profit', null);
		if (props.onProfitClear) {
			props.onProfitClear();
		}
	};

	const transactionsLabel = useMemo(() => {
		const transaction = form.watch('transactions');

		switch (transaction) {
			case TransactionsFilter['5K']:
				return tUtils('more-then-item', { item: '5K' });
			case TransactionsFilter['25K']:
				return tUtils('more-then-item', { item: '25K' });
			case TransactionsFilter['50K']:
				return tUtils('more-then-item', { item: '50K' });
			case TransactionsFilter['75K']:
				return tUtils('more-then-item', { item: '75K' });
			case TransactionsFilter['100K']:
				return tUtils('more-then-item', { item: '100K' });
			default:
				return null;
		}
	}, [form, tUtils]);

	const profitLabel = useMemo(() => {
		const profit = form.watch('profit');
		switch (profit) {
			case ProfitFilter['5%']:
				return tUtils('more-then-item', { item: '5%' });
			case ProfitFilter['25%']:
				return tUtils('more-then-item', { item: '25%' });
			case ProfitFilter['50%']:
				return tUtils('more-then-item', { item: '50%' });
			case ProfitFilter['75%']:
				return tUtils('more-then-item', { item: '75%' });
			case ProfitFilter['100%']:
				return tUtils('more-then-item', { item: '100%' });
			default:
				return null;
		}
	}, [form, tUtils]);

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="w-full">
				<div className="p-2 flex flex-col gap-4 w-full items-start">
					<FormField<FilterFormData, typeof FilterColumn.Filter>
						control={form.control}
						name={FilterColumn.Filter}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-small font-bold">{t('ranking.filter.filter-title')}</FormLabel>
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
											{t('ranking.filter.filter-recommend')}
										</Radio>
										<Radio
											size="sm"
											value={Filter.Manual}
											classNames={{
												base: 'rounded-lg max-w-1/2 m-0 border-1 border-divider w-1/2',
												label: 'text-xs',
											}}
										>
											{t('ranking.filter.filter-manual')}
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
								<FormLabel className="text-small font-bold">{t('ranking.filter.type-title')}</FormLabel>
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
											<span className="flex items-center gap-2">
												{t('ranking.filter.type-smart-money')}{' '}
												<Image src="/assets/images/smart-money.svg" width={16} height={16} alt="smart-money" />
											</span>
										</Checkbox>
										<Checkbox
											classNames={{
												base: 'border-1 border-divider rounded-lg m-0 max-w-full',
											}}
											size="sm"
											value={TypeFilter.Whale}
										>
											<span className="flex items-center gap-2">
												{t('ranking.filter.type-whale')}{' '}
												<Image src="/assets/images/whale.svg" width={16} height={16} alt="smart-money" />
											</span>
										</Checkbox>
										<Checkbox
											classNames={{
												base: 'border-1 border-divider rounded-lg m-0 max-w-full',
											}}
											size="sm"
											value={TypeFilter.Kol}
										>
											<span className="flex items-center gap-2">
												{t('ranking.filter.type-kol')}{' '}
												<Image src="/assets/images/kol.svg" width={16} height={16} alt="smart-money" />
											</span>
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
								<FormLabel className="text-small font-bold flex justify-between gap-2 items-center">
									<span>
										{t('ranking.filter.transaction-title')}
										{transactionsLabel && (
											<Button
												onPress={handleClearTransactions}
												variant="light"
												size="sm"
												color="primary"
												className="px-2 min-w-fit h-fit py-1"
											>
												{tAction('clear')}
											</Button>
										)}
									</span>
									<span className="text-xs">{transactionsLabel}</span>
								</FormLabel>
								<FormControl>
									<Slider
										className="max-w-full"
										color="foreground"
										value={field.value ?? 0}
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
								<FormLabel className="text-small font-bold flex justify-between gap-2 items-center">
									<span>
										{t('ranking.filter.profit-title')}
										{profitLabel && (
											<Button
												onPress={handleClearProfit}
												variant="light"
												size="sm"
												color="primary"
												className="px-2 min-w-fit h-fit py-1"
											>
												{tAction('clear')}
											</Button>
										)}
									</span>
									<span className="text-xs">{profitLabel}</span>
								</FormLabel>
								<FormControl>
									<Slider
										className="max-w-full"
										color="foreground"
										value={field.value ?? 0}
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
