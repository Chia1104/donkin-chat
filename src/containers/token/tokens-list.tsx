'use client';

import { useCallback } from 'react';

import { ButtonGroup } from '@heroui/button';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Select, SelectItem } from '@heroui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import InfoCard from '@/components/chat/preview/ai-signal/info-card';
import { useChatStore } from '@/contexts/chat-provider';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { cn } from '@/utils/cn';

interface FilterDate {
	id: number;
	name: string;
	value: string;
}

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

	// if (queryResult.isLoading) {
	// 	return <div>Loading...</div>;
	// } else if (queryResult.isError) {
	// 	return <div>Error: {queryResult.error.message}</div>;
	// }

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
					;
				</AnimatePresence>
			</ul>
		</>
	);
};

const TokensList = () => {
	const t = useTranslations('preview.ai-signal');

	const filterDates: FilterDate[] = [
		{
			id: 1,
			name: t('filter.date'),
			value: 'online',
		},
	];

	return (
		<div className="w-full h-full flex flex-col">
			<header className="flex items-center justify-end py-4">
				<div className="flex gap-4">
					<ButtonGroup aria-label="display" variant="bordered" radius="full" size="sm" className="relative">
						{/* <HeroButton aria-label="group" className="border-1 border-r-0" onPress={() => setDisplay('group')}>
							{display === 'group' ? <TileFieldIcon /> : <TileOutlineIcon />}
						</HeroButton>
						<Divider className="absolute top-1/4 h-1/2" orientation="vertical" />
						<HeroButton aria-label="single" className="border-1 border-l-0" onPress={() => setDisplay('single')}>
							{display === 'single' ? <SingleFieldIcon /> : <SingleOutlineIcon />}
						</HeroButton> */}
					</ButtonGroup>
					<Select
						aria-label="Filter Date"
						size="sm"
						classNames={{
							trigger: 'border-1 border-default',
						}}
						selectionMode="single"
						variant="bordered"
						radius="full"
						selectedKeys={[filterDates[0].value]}
						defaultSelectedKeys={[filterDates[0].value]}
						className="min-w-32"
						items={filterDates}
						placeholder="Select a network"
						renderValue={items => {
							return items.map(item =>
								item.data ? (
									<div key={item.key} className="flex items-center gap-2">
										<div className="flex flex-col">
											<span>{item.data.name}</span>
										</div>
									</div>
								) : null,
							);
						}}
					>
						{filterDate => (
							<SelectItem aria-label="Select a filter" key={filterDate.value} textValue={filterDate.name}>
								<div className="flex gap-2 items-center">
									<div className="flex flex-col">
										<span className="text-small">{filterDate.name}</span>
									</div>
								</div>
							</SelectItem>
						)}
					</Select>
				</div>
			</header>
			<ScrollShadow className="w-full h-[calc(100vh-156px)]">
				<List display="single" />
			</ScrollShadow>
		</div>
	);
};

export default TokensList;
