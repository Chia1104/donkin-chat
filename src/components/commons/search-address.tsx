'use client';

import { useRef } from 'react';

import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Avatar } from '@heroui/avatar';
import SearchIcon from '@mui/icons-material/Search';
import { useAsyncList } from '@react-stately/data';
import { useTranslations } from 'next-intl';

import { useCMD } from '@/hooks/useCMD';

interface Data {
	symbol: string;
	address: string;
	name: string;
	avatar: string;
}

const SearchAddress = () => {
	const t = useTranslations('nav');
	const tUtils = useTranslations('utils');
	const ref = useRef<HTMLInputElement>(null);

	const list = useAsyncList<Data>({
		load({ filterText }) {
			console.log(filterText);
			return {
				items: [],
			};
		},
	});

	useCMD(false, {
		cmd: 'k',
		onKeyDown: () => {
			ref.current?.focus();
		},
	});

	return (
		<Autocomplete
			inputValue={list.filterText}
			isLoading={list.isLoading}
			items={list.items}
			onInputChange={v => list.setFilterText(v)}
			placeholder={t('search-placeholder')}
			aria-label={t('search-placeholder')}
			variant="bordered"
			endContent={
				<SearchIcon
					sx={{
						width: 22,
						height: 22,
					}}
				/>
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
				emptyContent: tUtils('no-data'),
			}}
			isVirtualized={list.items.length > 10}
			isClearable={false}
		>
			{item => (
				<AutocompleteItem key={item.address} startContent={<Avatar src={item.avatar} />}>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{item.name}</span>
						<span className="text-sm text-foreground-500">{item.address}</span>
					</div>
				</AutocompleteItem>
			)}
		</Autocomplete>
	);
};

export default SearchAddress;
