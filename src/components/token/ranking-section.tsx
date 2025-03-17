'use client';

import { useState } from 'react';

import { Avatar, AvatarGroup } from '@heroui/avatar';
import { Divider } from '@heroui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Switch } from '@heroui/switch';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
	const locale = useLocale();

	return (
		<Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen} showArrow>
			<PopoverTrigger>
				<HeroButton
					size="sm"
					isIconOnly
					variant="light"
					aria-label="Filter"
					radius="full"
					isDisabled={!searchParams.mark}
				>
					<FilterAltOutlinedIcon
						sx={{
							width: 20,
							height: 20,
						}}
					/>
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
					thumb: 'bg-[rgba(255,_255,_255,_0.45)] w-[14px] h-[14px] min-h-[14px] min-w-[14px]',
					label: 'font-normal text-sm',
					wrapper: 'w-9 h-[18px]',
				}}
				className="text-sm font-normal"
				isSelected={!!searchParams.mark}
				onValueChange={e => setSearchParams({ mark: e })}
				size="sm"
			>
				{t('ranking.mark-smart')}
			</Switch>
			<Divider orientation="vertical" className="h-4" />
			<div className="flex items-center gap-5">
				<h3 className="text-sm font-normal">
					<span>
						{t('ranking.profit-rank')}
						<InfoOutlinedIcon
							sx={{
								width: '11px',
								height: '11px',
								marginLeft: '4px',
								color: '#FFFFFF40',
							}}
						/>
					</span>
				</h3>
				<AvatarGroup isGrid max={10} aria-label="Ranking" isDisabled={!searchParams.mark}>
					<Avatar
						aria-label="avatar"
						size="sm"
						classNames={{
							base: 'w-6 h-6',
						}}
					/>
					<Avatar
						aria-label="avatar"
						size="sm"
						classNames={{
							base: 'w-6 h-6',
						}}
					/>
					<Avatar
						aria-label="avatar"
						size="sm"
						classNames={{
							base: 'w-6 h-6',
						}}
					/>
					<Avatar
						aria-label="avatar"
						size="sm"
						classNames={{
							base: 'w-6 h-6',
						}}
					/>
				</AvatarGroup>
			</div>
			<Divider orientation="vertical" className="h-4" />
			<Filter />
		</Card>
	);
};

export default RankingSection;
