'use client';

import { useState } from 'react';

import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useLocale } from 'next-intl';

import FilterForm from '@/components/token/filter-form';
import { DEFAULT_FILTER_FORM_DATA } from '@/libs/token/hooks/useFilterFormSchema';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

export const FilterAction = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const locale = useLocale();

	return (
		<Popover radius="md" placement="top-start" isOpen={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger>
				<Button size="sm" isIconOnly variant="light" aria-label="Filter" radius="full" isDisabled={!searchParams.mark}>
					<FilterAltOutlinedIcon
						sx={{
							width: 20,
							height: 20,
						}}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn('w-[200px] overflow-hidden', locale === Locale.EN_US && 'w-[250px] max-w-[250px]')}>
				<FilterForm
					defaultValues={searchParams}
					onSubmit={value => {
						void setSearchParams({
							address: value.address ?? [],
							order: value.order ?? [],
							tmax: value.tmax,
							tmin: value.tmin,
							ocmax: value.ocmax,
							ocmin: value.ocmin,
						});
						void setIsOpen(false);
					}}
					onReset={() => {
						void setSearchParams(DEFAULT_FILTER_FORM_DATA);
						void setIsOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};
