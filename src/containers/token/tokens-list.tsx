'use client';

import { useCallback } from 'react';

import { ScrollShadow } from '@heroui/scroll-shadow';
import { Tabs, Tab } from '@heroui/tabs';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import InfoCard from '@/components/chat/preview/ai-signal/info-card';
import { useChatStore } from '@/contexts/chat-provider';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TokenSort } from '@/libs/ai/enums/tokenSort.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { cn } from '@/utils/cn';

const SortFilter = () => {
	const [searchParams, setSearchParams] = useAISearchParams();
	const t = useTranslations('preview.tokens-list.filter');

	const sortOptions = {
		[TokenSort.UpTime]: {
			id: TokenSort.UpTime,
			name: (
				<span className="flex items-center gap-2">
					<ScheduleIcon
						sx={{
							width: 12,
							height: 12,
							fill: 'currentColor',
						}}
					/>
					{t('up-time.label')}
				</span>
			),
		},
		[TokenSort.MarketCap]: {
			id: TokenSort.MarketCap,
			name: (
				<span className="flex items-center gap-2">
					<AttachMoneyIcon
						sx={{
							width: 12,
							height: 12,
							fill: 'currentColor',
						}}
					/>
					{t('market-cap')}
				</span>
			),
		},
		[TokenSort.Change]: {
			id: TokenSort.Change,
			name: (
				<span className="flex items-center gap-2">
					<TrendingUpIcon
						sx={{
							width: 12,
							height: 12,
							fill: 'currentColor',
						}}
					/>
					{t('change.label')}
				</span>
			),
		},
		[TokenSort.Hot]: {
			id: TokenSort.Hot,
			name: (
				<span className="flex items-center gap-2">
					<LocalFireDepartmentOutlinedIcon
						sx={{
							width: 12,
							height: 12,
							fill: 'currentColor',
						}}
					/>
					{t('hot')}
				</span>
			),
		},
	};

	return (
		<Tabs
			aria-label="filter time"
			size="sm"
			variant="light"
			selectedKey={searchParams.sort}
			onSelectionChange={key => {
				void setSearchParams({
					sort: key as TokenSort,
				});
			}}
			as="ul"
		>
			<Tab as="li" key={TokenSort.UpTime} title={sortOptions[TokenSort.UpTime].name} className="px-2" isDisabled />
			<Tab
				as="li"
				key={TokenSort.MarketCap}
				title={sortOptions[TokenSort.MarketCap].name}
				className="px-2"
				isDisabled
			/>
			<Tab as="li" key={TokenSort.Change} title={sortOptions[TokenSort.Change].name} className="px-2" isDisabled />
			<Tab as="li" key={TokenSort.Hot} title={sortOptions[TokenSort.Hot].name} className="px-2" />
		</Tabs>
	);
};

const List = ({ display }: { display: 'group' | 'single' }) => {
	const queryResult = useQueryTokensHot();
	const isPreviewOnly = useChatStore(state => state.isPreviewOnly);

	const { isLgWidth, isMdWidth, isSmWidth } = useMediaQuery();

	const getItemDisplay = useCallback(
		(index: number, length: number): ('all' | 'meta' | 'stock' | 'hotspots')[] => {
			const itemsPerRow = isPreviewOnly
				? isLgWidth
					? 4
					: isMdWidth
						? 3
						: isSmWidth
							? 2
							: 1
				: isLgWidth
					? 3
					: isMdWidth
						? 2
						: 1;

			const lastRowStartIndex = Math.floor((length - 1) / itemsPerRow) * itemsPerRow;
			const secondLastRowStartIndex = Math.floor((length - itemsPerRow - 1) / itemsPerRow) * itemsPerRow;

			if (display === 'group') {
				if (length <= itemsPerRow && index >= lastRowStartIndex) {
					return ['all'];
				} else if (length <= itemsPerRow * 2 && index < lastRowStartIndex) {
					return ['all'];
				} else if (length <= itemsPerRow * 2 && index >= lastRowStartIndex) {
					return ['meta', 'hotspots'];
				} else if (index >= lastRowStartIndex) {
					return ['meta'];
				} else if (index >= secondLastRowStartIndex) {
					return ['meta', 'hotspots'];
				} else {
					return ['all'];
				}
			} else {
				return ['all'];
			}
		},
		[isPreviewOnly, isLgWidth, isMdWidth, isSmWidth, display],
	);

	return (
		<>
			<ul
				className={cn(
					'grid grid-cols-1 gap-4 mb-4 w-full',
					isPreviewOnly ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2',
				)}
			>
				<AnimatePresence>
					{queryResult.data?.map((_, index) => {
						const length = queryResult.data.length;
						return (
							<motion.li className="w-full" key={index} exit={{ opacity: 1 }} layout>
								<InfoCard
									meta={{
										name: _.name,
										avatar: _.logo_uri ?? '',
										chain: _.symbol,
										token: _.address,
									}}
									stock={{
										marketCap: _.market_cap,
										price: _.price,
										pool: _.volume_24h,
										change: _.price_change_24h,
									}}
									hotspots={{
										x: 0,
										telegram: 0,
									}}
									display={getItemDisplay(index, length)}
									// onPress={data => {
									// 	router.push(`/${data.meta.chain}/token/${data.meta.token}`);
									// }}
									cardProps={{
										isPressable: false,
									}}
								/>
							</motion.li>
						);
					})}
					{queryResult.isLoading &&
						Array.from({ length: 10 }).map((_, index) => {
							return (
								<motion.li className="w-full" key={index} exit={{ opacity: 1 }} layout>
									<InfoCard
										meta={{
											name: '',
											avatar: '',
											chain: '',
											token: '',
										}}
										stock={{
											marketCap: 0,
											price: 0,
											pool: 0,
											change: 0,
										}}
										hotspots={{
											x: 0,
											telegram: 0,
										}}
										display={['all']}
										cardProps={{
											isPressable: false,
										}}
										isLoading
									/>
								</motion.li>
							);
						})}
				</AnimatePresence>
			</ul>
		</>
	);
};

const TokensList = () => {
	const t = useTranslations('preview.ai-signal');

	return (
		<div className="w-full h-full flex flex-col">
			<header className="flex items-center justify-end py-4">
				<div className="flex gap-4">
					<SortFilter />
				</div>
			</header>
			<ScrollShadow className="w-full h-[calc(100vh-156px)]">
				<List display="single" />
			</ScrollShadow>
		</div>
	);
};

export default TokensList;
