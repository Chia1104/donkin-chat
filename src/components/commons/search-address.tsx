'use client';

import type { Key } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Avatar } from '@heroui/avatar';
import { Spinner } from '@heroui/spinner';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';
import { useDebouncedValue } from '@tanstack/react-pacer/debouncer';
import { isNumber } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';

import { useCMD } from '@/hooks/useCMD';
import { useQueryTokenSearch } from '@/libs/token/hooks/useQueryToken';
import type { SearchToken } from '@/libs/token/pipes/token.pipe';
import { formatLargeNumber, truncateMiddle } from '@/utils/format';
import { logger } from '@/utils/logger';

const SearchAddress = () => {
	const t = useTranslations('nav');
	const tUtils = useTranslations('utils');
	const tToken = useTranslations('preview.tokens-list');
	const ref = useRef<HTMLInputElement>(null);
	const selectedSnapshot = useRef<SearchToken | null>(null);
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<SearchToken | null>(null);
	const router = useTransitionRouter();

	const [debouncedSearch] = useDebouncedValue(search, {
		wait: 800,
	});

	const handleSetSelected = (key: Key | null) => {
		const current = flatData.find(item => item.address === key);
		logger(current, { type: 'log' });
		if (current && current.address !== selectedSnapshot.current?.address) {
			selectedSnapshot.current = current;
			setSelected(current);
			router.push(`/${current.symbol}/token/${current.address}`);
		}
	};

	const { flatData, isLoading, isError, error, fetchNextPage, hasNextPage } = useQueryTokenSearch(
		{ token_keyword: debouncedSearch },
		{
			enabled: !!debouncedSearch,
		},
	);

	useEffect(() => {
		if (isError) {
			logger(error, { type: 'error' });
		}
	}, [error, isError]);

	useCMD(false, {
		cmd: 'k',
		onKeyDown: () => {
			ref.current?.focus();
		},
	});

	const [, scrollerRef] = useInfiniteScroll({
		hasMore: hasNextPage,
		shouldUseLoader: true,
		onLoadMore: () => {
			void fetchNextPage();
		},
	});

	return (
		<Autocomplete
			inputValue={search}
			items={flatData}
			selectedKey={selected?.address}
			onInputChange={setSearch}
			placeholder={t('search-placeholder')}
			aria-label={t('search-placeholder')}
			variant="bordered"
			endContent={
				isLoading ? <Spinner size="sm" /> : <span className="text-default-600 i-material-symbols-search size-[22px]" />
			}
			classNames={{
				base: 'min-w-[200px]',
				selectorButton: 'hidden',
				popoverContent: 'bg-[rgba(28,_38,_51,_1)] shadow-none rounded-sm px-0',
				listbox: 'px-0',
			}}
			radius="full"
			inputProps={{
				classNames: {
					inputWrapper: 'group-data-[focus=true]:border-default border-1 border-default',
				},
				ref,
			}}
			listboxProps={{
				emptyContent: isLoading ? tUtils('searching') : tUtils('no-result'),
			}}
			isVirtualized={flatData.length > 10}
			isClearable={false}
			onSelectionChange={handleSetSelected}
			scrollRef={scrollerRef}
			itemHeight={45}
		>
			{item => (
				<AutocompleteItem
					key={item.address}
					classNames={{
						base: 'px-3 py-2',
						wrapper: 'my-1 min-h-fit mx-0',
						selectedIcon: 'hidden',
					}}
				>
					<div className="flex justify-between gap-2">
						<div className="flex items-center gap-1">
							<Avatar src={item.logo_uri ?? item.name} className="w-6 h-6 min-w-6 min-h-6" />
							<div className="flex flex-col">
								<span className="text-xs line-clamp-1 leading-tight">{item.name}</span>
								<span className="text-[8px] text-foreground-500 line-clamp-1 leading-tight">
									{truncateMiddle(item.address, item.address.length / 3)}
								</span>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-xs leading-tight">
								{isNumber(item.market_cap) ? formatLargeNumber(item.market_cap) : '-'}
							</span>
							<span className="text-[8px] text-foreground-500 leading-tight">{tToken('filter.market-cap')}</span>
						</div>
					</div>
				</AutocompleteItem>
			)}
		</Autocomplete>
	);
};

export default SearchAddress;
