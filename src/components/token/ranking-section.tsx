'use client';

import { useState } from 'react';

import { Avatar, AvatarGroup } from '@heroui/avatar';
import { Divider } from '@heroui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Switch } from '@heroui/switch';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import FilterForm from '@/components/token/filter-form';
import Card from '@/components/ui/card';
import { DEFAULT_FILTER_FORM_DATA } from '@/libs/token/hooks/useFilterFormSchema';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import { Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { HeroButton } from '../ui/hero-button';

const Filter = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const locale = useLocale() as Locale;

	return (
		<Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen} showArrow>
			<PopoverTrigger>
				<HeroButton isIconOnly variant="light" aria-label="Filter" radius="full" isDisabled={!searchParams.mark}>
					<FilterAltOutlinedIcon />
				</HeroButton>
			</PopoverTrigger>
			<PopoverContent className={cn('w-[200px] overflow-hidden', locale === Locale.EN_US && 'w-[250px] max-w-[250px]')}>
				<FilterForm
					defaultValues={searchParams}
					onSubmit={value => {
						void setSearchParams(value);
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

const RankingSection = () => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const t = useTranslations('token');
	return (
		<Card className="w-full px-4 py-6 flex-row items-center justify-between">
			<Switch
				aria-label={t('ranking.mark-smart')}
				classNames={{
					base: 'flex-row-reverse gap-6',
					thumb: 'bg-[rgba(255,_255,_255,_0.45)]',
				}}
				className="text-sm font-normal"
				isSelected={!!searchParams.mark}
				onValueChange={e => setSearchParams({ mark: e })}
				size="md"
			>
				{t('ranking.mark-smart')}
			</Switch>
			<Divider orientation="vertical" className="h-4" />
			<div className="flex items-center gap-5">
				<h3 className="text-sm font-normal">Ranking</h3>
				<AvatarGroup isGrid max={10} aria-label="Ranking" isDisabled={!searchParams.mark}>
					<Avatar aria-label="avatar" />
					<Avatar aria-label="avatar" />
					<Avatar aria-label="avatar" />
					<Avatar aria-label="avatar" />
				</AvatarGroup>
			</div>
			<Divider orientation="vertical" className="h-4" />
			<Filter />
		</Card>
	);
};

export default RankingSection;
