'use client';

import { useState } from 'react';

import { Avatar, AvatarGroup } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Switch } from '@heroui/switch';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useTranslations } from 'next-intl';

import FilterForm from '@/components/token/filter-form';
import Card from '@/components/ui/card';
import { DEFAULT_FILTER_FORM_DATA } from '@/libs/token/hooks/useFilterFormSchema';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';

const Filter = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchParams, setSearchParams] = useTokenSearchParams();

	return (
		<Popover
			placement="top"
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			showArrow
			classNames={{
				arrow: 'bg-[#292828]',
			}}
			className="before:bg-[#292828]"
		>
			<PopoverTrigger>
				<Button isIconOnly variant="light" aria-label="Filter" radius="full">
					<FilterAltOutlinedIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] overflow-hidden bg-[#292828]">
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
