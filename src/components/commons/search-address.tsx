'use client';

import { useEffect, useRef, useState } from 'react';

import type { AutocompleteProps } from '@heroui/autocomplete';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Avatar } from '@heroui/avatar';
import { Spinner } from '@heroui/spinner';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';
import { useDebouncedValue } from '@tanstack/react-pacer/debouncer';
import { isNumber } from 'lodash-es';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';

import { useAuthGuard } from '@/components/auth/auth-guard';
import { useCMD } from '@/hooks/useCMD';
import { useQueryTokenSearch } from '@/libs/token/hooks/useQueryToken';
import { useQuerySolBalance } from '@/libs/web3/hooks/useGetSolBalance';
import { formatLargeNumber, truncateMiddle } from '@/utils/format';
import { logger } from '@/utils/logger';

const SearchAddress = (props: Partial<AutocompleteProps>) => {
	const t = useTranslations('nav');
	const tUtils = useTranslations('utils');
	const tToken = useTranslations('preview.tokens-list');
	const tRoutes = useTranslations('routes');
	const ref = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<{ address: string; symbol: string } | null>(null);
	const router = useTransitionRouter();
	const { canActivate } = useAuthGuard('SearchAddress');

	const [debouncedSearch] = useDebouncedValue(search, {
		wait: 800,
	});

	const {
		flatData,
		isLoading: isTokenLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
	} = useQueryTokenSearch(
		{ token_keyword: debouncedSearch },
		{
			enabled: !!debouncedSearch,
		},
	);

	const {
		data: addressData,
		isLoading: isAddressLoading,
		isError: isAddressError,
		error: addressError,
		isSuccess: isAddressSuccess,
	} = useQuerySolBalance(
		{
			address: debouncedSearch,
			network: 'devnet',
		},
		{
			enabled: !!debouncedSearch,
		},
	);

	useEffect(() => {
		if (isError) {
			logger(['get token error', error], { type: 'error' });
		}
		if (isAddressError) {
			logger(['get solana balance error', addressError], { type: 'error' });
		}
	}, [error, isError, addressError, isAddressError]);

	useCMD(
		false,
		{
			cmd: 'k',
			onKeyDown: () => {
				if (canActivate) {
					ref.current?.focus();
				}
			},
		},
		[canActivate],
	);

	const [, scrollerRef] = useInfiniteScroll({
		hasMore: hasNextPage,
		shouldUseLoader: true,
		onLoadMore: () => {
			void fetchNextPage();
		},
	});

	const isLoading = isTokenLoading || isAddressLoading;

	const concatData = isLoading
		? []
		: flatData.length === 0 && addressData != null && debouncedSearch && isAddressSuccess
			? flatData.concat([
					{
						address: debouncedSearch,
						symbol: 'sol',
						name: tRoutes('wallet.title'),
						market_cap: 0,
						logo_uri: '/assets/images/default-avatar.png',
					},
				])
			: flatData;

	return (
		<Autocomplete
			inputValue={search}
			items={concatData}
			selectedKey={selected?.address}
			onInputChange={setSearch}
			placeholder={t('search-placeholder')}
			aria-label={t('search-placeholder')}
			variant="bordered"
			endContent={
				isLoading ? <Spinner size="sm" /> : <span className="text-default-600 i-material-symbols-search size-[20px]" />
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
			scrollRef={scrollerRef}
			itemHeight={45}
			{...props}
		>
			{concatData.map((item, index) => {
				return (
					<AutocompleteItem
						key={`${item.address}-${index}`}
						classNames={{
							base: 'px-3 py-2',
							wrapper: 'my-1 min-h-fit mx-0',
							selectedIcon: 'hidden',
						}}
						onPress={() => {
							setSearch('');
							setSelected(item);
							router.push(
								item.name === tRoutes('wallet.title')
									? `/global/address/${item.address}`
									: `/sol/token/${item.address}`,
							);
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
							{item.name !== tRoutes('wallet.title') && (
								<div className="flex flex-col items-end">
									<span className="text-xs leading-tight">
										{isNumber(item.market_cap) ? formatLargeNumber(item.market_cap) : '-'}
									</span>
									<span className="text-[8px] text-foreground-500 leading-tight">{tToken('filter.market-cap')}</span>
								</div>
							)}
						</div>
					</AutocompleteItem>
				);
			})}
		</Autocomplete>
	);
};

export default SearchAddress;
