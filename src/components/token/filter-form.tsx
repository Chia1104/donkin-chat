'use client';

import { ChangeEvent } from 'react';

import { CheckboxGroup, Checkbox } from '@heroui/checkbox';
import { Divider } from '@heroui/divider';
import { NumberInput } from '@heroui/number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormItem, FormLabel, FormField } from '@/components/ui/form';
import SubmitForm from '@/components/ui/submit-form';
import { Address } from '@/libs/token/enums/address.enum';
import { FilterColumn } from '@/libs/token/enums/filter-column.enum';
import { Order } from '@/libs/token/enums/order.enum';
import type { FilterFormData, TransformedFilterFormData } from '@/libs/token/hooks/useFilterFormSchema';
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
	const form = useForm<TransformedFilterFormData, any, FilterFormData>({
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

	const handleNumberInputChange = (
		value: number | ChangeEvent<HTMLInputElement>,
		onChange: (value: number | null) => void,
	) => {
		if (isNaN(value as number)) {
			onChange(null);
			return;
		}

		onChange(value as number);
	};

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="w-full">
				<div className="p-2 flex flex-col gap-4 w-full items-start">
					<FormField<TransformedFilterFormData, typeof FilterColumn.Address>
						control={form.control}
						name={FilterColumn.Address}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-xs font-normal text-description">{t('ranking.filter.type-title')}</FormLabel>
								<FormControl className="w-full">
									<CheckboxGroup
										className="w-full"
										classNames={{
											wrapper: 'w-full',
										}}
										aria-label="type"
										value={field.value ?? []}
										onChange={field.onChange}
										radius="md"
									>
										<Checkbox
											radius="md"
											classNames={{
												base: 'bg-background rounded-lg m-0 max-w-full',
												wrapper:
													'bg-transparent group-data-[hover=true]:before:bg-background before:border-white before:border-1 before:rounded-sm after:rounded-sm rounded-sm',
												label: 'font-medium text-xs',
											}}
											size="sm"
											value={Address.SmartMoney}
											aria-label={t('ranking.filter.type-smart-money')}
										>
											<span className="flex items-center gap-2">{t('ranking.filter.type-smart-money')} </span>
										</Checkbox>
										<Checkbox
											classNames={{
												base: 'bg-background rounded-lg m-0 max-w-full',
												wrapper:
													'bg-transparent group-data-[hover=true]:before:bg-background before:border-white before:border-1 before:rounded-sm after:rounded-sm rounded-sm',
												label: 'font-medium text-xs',
											}}
											radius="md"
											size="sm"
											value={Address.Whale}
											aria-label={t('ranking.filter.type-whale')}
										>
											<span className="flex items-center gap-2">{t('ranking.filter.type-whale')} </span>
										</Checkbox>
									</CheckboxGroup>
								</FormControl>
							</FormItem>
						)}
					/>
					<div className="w-full space-y-2">
						<FormItem className="w-full">
							<FormLabel className="text-xs font-normal text-description">
								{t('ranking.filter.transaction-title')}
							</FormLabel>
						</FormItem>
						<div className="flex gap-1 items-center">
							<FormField<TransformedFilterFormData, typeof FilterColumn.TransactionMin>
								control={form.control}
								name={FilterColumn.TransactionMin}
								render={({ field, fieldState }) => (
									<FormItem className="w-full">
										<FormControl className="w-full">
											<NumberInput
												size="sm"
												radius="md"
												className="w-full"
												placeholder={tUtils('enter')}
												classNames={{
													mainWrapper: 'h-8',
													inputWrapper: 'min-h-full max-h-full px-1.5',
												}}
												{...field}
												value={(field.value as number) ?? undefined}
												onChange={value => handleNumberInputChange(value, field.onChange)}
												isInvalid={fieldState.invalid}
												variant="bordered"
												hideStepper
												aria-label={t('ranking.filter.transaction-title')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Divider className="w-2" />
							<FormField<TransformedFilterFormData, typeof FilterColumn.TransactionMax>
								control={form.control}
								name={FilterColumn.TransactionMax}
								render={({ field, fieldState }) => (
									<FormItem className="w-full">
										<FormControl className="w-full">
											<NumberInput
												size="sm"
												radius="md"
												className="w-full"
												placeholder={tUtils('enter')}
												classNames={{
													mainWrapper: 'h-8',
													inputWrapper: 'min-h-full max-h-full px-1.5',
												}}
												{...field}
												value={(field.value as number) ?? undefined}
												onChange={value => handleNumberInputChange(value, field.onChange)}
												isInvalid={fieldState.invalid}
												variant="bordered"
												hideStepper
												aria-label={t('ranking.filter.transaction-title')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Divider />
					<FormField<TransformedFilterFormData, typeof FilterColumn.Order>
						control={form.control}
						name={FilterColumn.Order}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-xs font-normal text-description">
									{t('ranking.filter.order-title')}
								</FormLabel>
								<FormControl className="w-full">
									<CheckboxGroup
										className="w-full"
										classNames={{
											wrapper: 'w-full',
										}}
										aria-label="type"
										value={field.value ?? []}
										onChange={field.onChange}
										radius="md"
									>
										<Checkbox
											classNames={{
												base: 'bg-background rounded-lg m-0 max-w-full',
												wrapper:
													'bg-transparent group-data-[hover=true]:before:bg-background before:border-white before:border-1 before:rounded-sm after:rounded-sm rounded-sm',
												label: 'font-medium text-xs',
											}}
											size="sm"
											radius="md"
											value={Order.KOL}
											aria-label={t('ranking.filter.type-kol')}
										>
											<span className="flex items-center gap-2">{t('ranking.filter.type-kol')} </span>
										</Checkbox>
									</CheckboxGroup>
								</FormControl>
							</FormItem>
						)}
					/>
					<div className="w-full space-y-2">
						<FormItem className="w-full">
							<FormLabel className="text-xs font-normal text-description">{t('ranking.filter.kol-order')}</FormLabel>
						</FormItem>
						<div className="flex gap-1 items-center">
							<FormField<TransformedFilterFormData, typeof FilterColumn.OrderCountMin>
								control={form.control}
								name={FilterColumn.OrderCountMin}
								render={({ field, fieldState }) => (
									<FormItem className="w-full">
										<FormControl className="w-full">
											<NumberInput
												size="sm"
												radius="md"
												className="w-full"
												placeholder={tUtils('enter')}
												classNames={{
													mainWrapper: 'h-8',
													inputWrapper: 'min-h-full max-h-full px-1.5',
												}}
												{...field}
												value={(field.value as number) ?? undefined}
												onChange={value => handleNumberInputChange(value, field.onChange)}
												isInvalid={fieldState.invalid}
												variant="bordered"
												hideStepper
												aria-label={t('ranking.filter.kol-order')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Divider className="w-2" />
							<FormField<TransformedFilterFormData, typeof FilterColumn.OrderCountMax>
								control={form.control}
								name={FilterColumn.OrderCountMax}
								render={({ field, fieldState }) => (
									<FormItem className="w-full">
										<FormControl className="w-full">
											<NumberInput
												size="sm"
												radius="md"
												className="w-full"
												placeholder={tUtils('enter')}
												classNames={{
													mainWrapper: 'h-8',
													inputWrapper: 'min-h-full max-h-full px-1.5',
												}}
												{...field}
												value={(field.value as number) ?? undefined}
												onChange={value => handleNumberInputChange(value, field.onChange)}
												isInvalid={fieldState.invalid}
												variant="bordered"
												hideStepper
												aria-label={t('ranking.filter.kol-order')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-2 w-full justify-between mt-4">
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
