'use client';

import { useState } from 'react';

import { Avatar, AvatarGroup } from '@heroui/avatar';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
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

const Filter = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const locale = useLocale();

	return (
		<Popover placement="top-start" isOpen={isOpen} onOpenChange={setIsOpen}>
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

const RankingSection = () => {
	const [searchParams, setSearchParams] = useTokenSearchParams();
	const t = useTranslations('token');
	return (
		<Card className="w-full px-4 py-6 flex-row items-center gap-10">
			<Switch
				aria-label={t('ranking.mark-smart')}
				classNames={{
					base: 'flex-row-reverse gap-6 items-center',
					thumb: 'bg-[rgba(255,_255,_255,_0.45)] w-[14px] h-[14px] min-h-[14px] min-w-[14px]',
					label: 'font-normal text-sm',
					wrapper: 'w-9 h-[18px]',
				}}
				className="text-sm font-normal"
				isSelected={!!searchParams.mark}
				onValueChange={e => setSearchParams({ mark: e })}
				size="sm"
			>
				<span className="flex items-center">
					{t('ranking.mark-smart')}
					<Filter />
				</span>
			</Switch>
			<Divider orientation="vertical" className="h-4" />
			<div className="flex items-center gap-5">
				<h3 className="text-sm font-normal">
					<span>
						{t('ranking.profit-rank')}
						<InfoOutlinedIcon
							sx={{
								width: '16px',
								height: '16px',
								marginLeft: '4px',
								color: '#FFFFFF40',
							}}
						/>
					</span>
				</h3>
				<AvatarGroup isGrid max={10} aria-label="Ranking" isDisabled={!searchParams.mark}>
					<Badge
						content={<Image src="/assets/images/crown.svg" width={10} height={10} />}
						placement="top-left"
						classNames={{
							badge: 'border-0 bg-transparent p-0 top-[5%] left-[5%]',
						}}
						showOutline={false}
						isOneChar
						isDot
					>
						<Avatar
							aria-label="avatar"
							size="sm"
							classNames={{
								base: 'w-6 h-6',
							}}
						/>
					</Badge>
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
		</Card>
	);
};

export default RankingSection;
