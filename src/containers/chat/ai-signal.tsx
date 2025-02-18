'use client';

import { useState, useCallback } from 'react';

import { Button, ButtonGroup } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Select, SelectItem } from '@heroui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import InfoCard, { MOCK_DATA } from '@/components/chat/preview/ai-signal/info-card';
import { useChatStore } from '@/contexts/chat-provider';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

interface FilterDate {
	id: number;
	name: string;
	value: string;
}

const TileOutlineIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			fill="#fff"
			fillOpacity="0.45"
			d="M4.3 19.7v-4.626h6.425V19.7zm8.925 0v-4.626H19.7V19.7zM5 19h5.025v-3.226H5zm8.925 0H19v-3.226h-5.075z"
		></path>
		<path stroke="#fff" strokeOpacity="0.45" strokeWidth="0.75" d="M4.676 4.375h14.65v8.25H4.676z"></path>
	</svg>
);

const TileFieldIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			fill="#fff"
			fillOpacity="0.85"
			d="M4.3 19.7v-4.624h6.425V19.7zm8.925 0v-4.624H19.7V19.7zM5 19h5.025v-3.224H5zm8.925 0H19v-3.224h-5.075zM4.3 12.577V4.3h15.4v8.275z"
		></path>
	</svg>
);

const SingleOutlineIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
		/>
	</svg>
);

const SingleFieldIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
		<path
			fillRule="evenodd"
			d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
			clipRule="evenodd"
		/>
	</svg>
);

const AiSignal = () => {
	const [display, setDisplay] = useState<'group' | 'single'>('group');
	const t = useTranslations('preview.ai-signal');
	const { isPreviewOnly } = useChatStore(state => state);

	const filterDates: FilterDate[] = [
		{
			id: 1,
			name: t('filter.date'),
			value: 'online',
		},
	];

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
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-full h-full flex flex-col"
		>
			<header className="flex items-center justify-between p-4">
				<h2 className="text-2xl font-bold">{t('title')}</h2>
				<div className="flex gap-4">
					<ButtonGroup aria-label="display" variant="bordered" radius="full" size="sm" className="relative">
						<Button aria-label="group" className="border-1 border-r-0" onPress={() => setDisplay('group')}>
							{display === 'group' ? <TileFieldIcon /> : <TileOutlineIcon />}
						</Button>
						<Divider className="absolute top-1/4 h-1/2" orientation="vertical" />
						<Button aria-label="single" className="border-1 border-l-0" onPress={() => setDisplay('single')}>
							{display === 'single' ? <SingleFieldIcon /> : <SingleOutlineIcon />}
						</Button>
					</ButtonGroup>
					<Select
						aria-label="Filter Date"
						size="sm"
						classNames={{
							trigger: 'border-1',
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
				<ul
					className={cn(
						'grid grid-cols-1 gap-4 mb-4 w-full',
						isPreviewOnly ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2',
					)}
				>
					<AnimatePresence>
						{Array.from({ length: 9 }).map((_, index) => {
							const length = 9;
							return (
								<motion.li className="w-full" key={index} exit={{ opacity: 1 }} layout>
									<InfoCard {...MOCK_DATA} display={getItemDisplay(index, length)} />
								</motion.li>
							);
						})}
					</AnimatePresence>
				</ul>
				<div className="flex justify-center">
					<Button aria-label="More" size="sm" variant="light" endContent={<ChevronDown className="size-3" />}>
						{t('action.more')}
					</Button>
				</div>
			</ScrollShadow>
		</motion.div>
	);
};

export default AiSignal;
