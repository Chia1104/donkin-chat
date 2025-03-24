'use client';

import { Avatar, AvatarGroup } from '@heroui/avatar';
import { Badge } from '@heroui/badge';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { Switch } from '@heroui/switch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslations } from 'next-intl';

import Card from '@/components/ui/card';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';

import { FilterAction } from './filter-action';

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
					<FilterAction />
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
