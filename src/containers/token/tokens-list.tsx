'use client';

import { useCallback, useMemo } from 'react';

import { ButtonGroup } from '@heroui/button';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { RadioGroup, Radio } from '@heroui/radio';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Spinner } from '@heroui/spinner';
import { useDisclosure } from '@heroui/use-disclosure';
import SvgIcon from '@mui/material/SvgIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';
import { VirtuosoGrid } from 'react-virtuoso';

import { AsyncQuery } from '@/components/commons/async-query';
import { ErrorBoundary } from '@/components/commons/error-boundary';
import InfoCard from '@/components/token/info-card';
import { HeroButton } from '@/components/ui/hero-button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TokenSort } from '@/libs/ai/enums/tokenSort.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

import AscIcon from '~/public/assets/images/asc.svg';
import DscIcon from '~/public/assets/images/dsc.svg';

const SortFilter = () => {
	const [searchParams, setSearchParams] = useAISearchParams();
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const t = useTranslations('preview.tokens-list.filter');

	const sortOptions = useMemo(
		() => ({
			[TokenSort.Hot]: {
				id: TokenSort.Hot,
				name: t('hot'),
			},
			[TokenSort.Change]: {
				id: TokenSort.Change,
				name: t('change.label'),
			},
			[TokenSort.MarketCap]: {
				id: TokenSort.MarketCap,
				name: t('market-cap'),
			},
			[TokenSort.UpTime]: {
				id: TokenSort.UpTime,
				name: t('up-time.label'),
			},
		}),
		[t],
	);

	const label = useMemo(() => {
		return `${sortOptions[searchParams.sort].name}: ${searchParams.order === 'asc' ? t('order.asc') : t('order.des')}`;
	}, [searchParams.order, searchParams.sort, sortOptions, t]);

	return (
		<Popover isOpen={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger>
				<Button variant="light" className="p-2 min-w-fit h-8 items-center flex text-sm" radius="sm">
					{label} <ArrowUpDownIcon size={14} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="shadow-none border-0 min-w-[200px] rounded-sm p-0 bg-[rgba(28,_38,_51,_1)] overflow-hidden">
				<RadioGroup
					value={searchParams.sort}
					onValueChange={value => {
						void setSearchParams({ sort: value as TokenSort });
					}}
					className="w-full px-0 py-2"
					classNames={{
						wrapper: 'gap-0',
					}}
				>
					{Object.values(sortOptions).map(option => {
						return (
							<Radio
								classNames={{
									base: 'w-full max-w-full py-3 px-4 m-0 data-[hover=true]:bg-default data-[selected=true]:bg-default',
									wrapper: 'border-divider',
									labelWrapper: 'ml-4',
								}}
								size="sm"
								key={option.id}
								value={option.id}
							>
								{option.name}
							</Radio>
						);
					})}
				</RadioGroup>
				<Divider />
				<ButtonGroup className="w-full">
					<HeroButton
						variant="light"
						className="w-full p-4 min-w-fit items-center flex text-sm border-r-[0.5px] border-divider"
						radius="none"
						onPress={() => {
							void setSearchParams({ order: 'asc' });
							onClose();
						}}
						color={searchParams.order === 'asc' ? 'primary' : 'default'}
					>
						<SvgIcon
							viewBox="0 0 16 17"
							sx={{
								fontSize: '16px',
								path: {
									fill: searchParams.order === 'asc' ? 'rgba(53, 205, 255, 1)' : '#fff',
								},
								rect: {
									stroke: searchParams.order === 'asc' ? 'rgba(53, 205, 255, 1)' : '#fff',
								},
							}}
						>
							<AscIcon />
						</SvgIcon>
						{t('up-time.asc')}
					</HeroButton>
					<HeroButton
						variant="light"
						className="w-full p-4 min-w-fit items-center flex text-sm border-l-[0.5px] border-divider"
						radius="none"
						onPress={() => {
							void setSearchParams({ order: 'desc' });
							onClose();
						}}
						color={searchParams.order === 'desc' ? 'primary' : 'default'}
					>
						<SvgIcon
							viewBox="0 0 16 17"
							sx={{
								fontSize: '16px',
								path: {
									fill: searchParams.order === 'desc' ? 'rgba(53, 205, 255, 1)' : '#fff',
								},
								rect: {
									stroke: searchParams.order === 'desc' ? 'rgba(53, 205, 255, 1)' : '#fff',
								},
							}}
						>
							<DscIcon />
						</SvgIcon>
						{t('up-time.des')}
					</HeroButton>
				</ButtonGroup>
			</PopoverContent>
		</Popover>
	);
};

const List = ({ display }: { display: 'group' | 'single' }) => {
	const [searchParams] = useAISearchParams();
	const queryResult = useQueryTokensHot(
		{
			page_size: 20,
			sort_by: searchParams.sort,
			order: searchParams.order,
		},
		{
			refetchInterval: 30_000,
		},
	);
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const router = useTransitionRouter();

	const { isLgWidth, isMdWidth, isSmWidth } = useMediaQuery();

	const getItemDisplay = useCallback(
		(index: number, length: number): ('all' | 'meta' | 'stock' | 'hotspots')[] => {
			const itemsPerRow = !isOpen
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
		[isOpen, isLgWidth, isMdWidth, isSmWidth, display],
	);

	return (
		<AsyncQuery
			queryResult={queryResult}
			isInfinite
			loadingFallback={
				<ul
					className={cn(
						'grid grid-cols-1 gap-4 mb-4 w-full',
						!isOpen ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2',
					)}
				>
					<AnimatePresence>
						{Array.from({ length: 12 }).map((_, index) => {
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
			}
		>
			<VirtuosoGrid
				endReached={() => {
					void queryResult.fetchNextPage();
				}}
				components={{
					List: ({ style, children, ref, ...props }) => (
						<ul
							style={style}
							ref={ref as any}
							{...props}
							className={cn(
								'grid grid-cols-1 gap-4 mb-4 w-full min-h-full',
								!isOpen ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2',
							)}
						>
							{children}
						</ul>
					),
					Item: ({ children, ...props }) => (
						// @ts-expect-error - virtuoso type error
						<li className="w-full" {...props}>
							{children}
						</li>
					),
					Scroller: ({ children, ...props }) => (
						<ScrollShadow className="w-full h-[calc(100vh-156px)]" {...props}>
							{children}
						</ScrollShadow>
					),
					Footer: () =>
						queryResult.isFetchingNextPage ? (
							<div className="flex justify-center items-center h-full py-5">
								<Spinner className="space-y-5 justify-self-center" />
							</div>
						) : null,
				}}
				data={queryResult.flatData ?? []}
				totalCount={queryResult.flatData?.length ?? 0}
				overscan={10}
				itemContent={(index, _) => {
					return (
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
								pool: _.liquidity,
								change: _.change,
							}}
							hotspots={{
								x: 0,
								telegram: 0,
							}}
							display={getItemDisplay(index, length)}
							onPress={data => {
								router.push(`/${data.meta.chain}/token/${data.meta.token}`);
							}}
							cardProps={{
								isPressable: true,
							}}
						/>
					);
				}}
			/>
		</AsyncQuery>
	);
};

const TokensList = () => {
	return (
		<div className="w-full h-full flex flex-col">
			<header className="flex items-center justify-end py-4">
				<div className="flex gap-4">
					<SortFilter />
				</div>
			</header>
			<ErrorBoundary>
				<List display="single" />
			</ErrorBoundary>
		</div>
	);
};

export default TokensList;
