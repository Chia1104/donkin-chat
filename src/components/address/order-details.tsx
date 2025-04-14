'use client';

import { useMemo, memo, useEffect } from 'react';

import { Avatar } from '@heroui/avatar';
import { ScrollShadow, Spinner, Tooltip } from '@heroui/react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import { useAsyncList } from '@react-stately/data';
import { useTranslations } from 'next-intl';

import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import type { Address } from '@/libs/address/pipes/address.pipe';
import { useAskToken } from '@/libs/ai/hooks/useAskToken';
import dayjs from '@/utils/dayjs';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isNumber, isPositiveNumber } from '@/utils/is';

import DonkinPopover from '../donkin/popover';

const useColumns = (): { key: string; label: string; allowsSorting?: boolean }[] => {
	const t = useTranslations('address.order-details');

	return [
		{
			key: 'symbol',
			label: t('symbol'),
		},
		{
			key: 'amount',
			label: t('amount'),
			allowsSorting: true,
		},
		{
			key: 'price',
			label: t('price'),
		},
		{
			key: 'value',
			label: t('value'),
			allowsSorting: true,
		},
		{
			key: 'profit',
			label: t('profit'),
			allowsSorting: true,
		},
		{
			key: 'transaction-count',
			label: t('transaction-count'),
		},
	];
};

interface Data {
	symbol: string;
	avatar: string;
	amount: number;
	price: number;
	value: number;
	profit: number;
	'transaction-count': {
		buy?: number | null;
		sell?: number | null;
	};
}

export const MOCK_ROWS: Data[] = [
	{
		symbol: 'BTC',
		avatar: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747033579',
		amount: 100084732,
		price: 0.05446,
		value: 5800,
		profit: 5800,
		'transaction-count': {
			buy: 3,
			sell: 2,
		},
	},
	{
		symbol: 'ETH',
		avatar: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1746016417',
		amount: 323977245,
		price: 0.2701,
		value: 87400,
		profit: 87400,
		'transaction-count': {
			buy: 4,
			sell: 2,
		},
	},
	{
		symbol: 'SOL',
		avatar: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640548065',
		amount: 100084732,
		price: 0.05446,
		value: 5800,
		profit: 5800,
		'transaction-count': {
			buy: 4,
			sell: 2,
		},
	},
	{
		symbol: 'USDT',
		avatar: 'https://assets.coingecko.com/coins/images/3408/large/usdt.png?1746042870',
		amount: 100084732,
		price: 0.05446,
		value: 5800,
		profit: 5800,
		'transaction-count': {
			buy: 4,
			sell: 2,
		},
	},
	{
		symbol: 'USDC',
		avatar: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1746042738',
		amount: 100084732,
		price: 0.05446,
		value: 5800,
		profit: 5800,
		'transaction-count': {
			buy: 4,
			sell: 2,
		},
	},
];

const Cell = memo(({ item, columnKey }: { item: Data; columnKey: keyof Data }) => {
	const askToken = useAskToken(item.symbol);

	switch (columnKey) {
		case 'symbol':
			return (
				<Tooltip
					content={<DonkinPopover className="w-[220px]" {...askToken} />}
					classNames={{
						base: 'shadow-none',
						content: 'bg-transparent shadow-none p-0',
					}}
				>
					<span className="flex items-center gap-2">
						<Avatar src={item.avatar} size="sm" className="w-4 h-4" />
						{item.symbol}
					</span>
				</Tooltip>
			);
		case 'amount':
			return (
				<span className="text-white">{isNumber(item[columnKey]) ? `$${formatLargeNumber(item[columnKey])}` : '-'}</span>
			);
		case 'price':
			return (
				<span className="text-white">{isNumber(item[columnKey]) ? `$${roundDecimal(item[columnKey], 10)}` : '-'}</span>
			);
		case 'value':
			return (
				<span className="text-white">{isNumber(item[columnKey]) ? `$${roundDecimal(item[columnKey], 2)}` : '-'}</span>
			);
		case 'profit':
			return (
				<span
					className={
						isNumber(item[columnKey])
							? isPositiveNumber(item[columnKey])
								? 'text-success'
								: 'text-danger'
							: 'text-white'
					}
				>
					{isNumber(item[columnKey])
						? `$${isNumber(item[columnKey]) ? roundDecimal(item[columnKey], 2) : item[columnKey]}`
						: '-'}
				</span>
			);
		case 'transaction-count':
			return (
				<span className="flex items-center gap-1">
					<p className="text-sm font-normal text-success">{item['transaction-count'].buy}</p>/
					<p className="text-sm font-normal text-danger">{item['transaction-count'].sell}</p>
				</span>
			);
		default:
			return item[columnKey];
	}
});

const OrderDetails = <TMock extends boolean = false>({
	data,
	mock,
	isPending,
}: {
	data: TMock extends true ? undefined : Address;
	mock?: TMock;
	isPending?: boolean;
}) => {
	const columns = useColumns();
	const [searchParams] = useAddressSearchParams();
	const t = useTranslations('address.order-details');
	const tUtils = useTranslations('utils');

	const date = useMemo(() => {
		switch (searchParams.interval) {
			case IntervalFilter.OneWeek:
				return {
					start: dayjs().subtract(1, 'week').startOf('day').format('YYYY-MM-DD'),
					end: dayjs().endOf('day').format('YYYY-MM-DD'),
				};
			case IntervalFilter.OneMonth:
				return {
					start: dayjs().subtract(1, 'month').startOf('day').format('YYYY-MM'),
					end: dayjs().endOf('day').format('YYYY-MM'),
				};
			default:
				return {
					start: dayjs().subtract(1, 'week').startOf('day').format('YYYY-MM-DD'),
					end: dayjs().endOf('day').format('YYYY-MM-DD'),
				};
		}
	}, [searchParams]);

	const list = useAsyncList({
		load() {
			if (mock) {
				return {
					items: MOCK_ROWS,
				};
			}

			if (!data?.token_pnls) {
				return {
					items: [],
				};
			}

			return {
				items: data.token_pnls?.map(
					token =>
						({
							symbol: token.symbol,
							avatar: token.url,
							amount: Number(token.amount),
							price: Number(token.price),
							value: Number(token.value),
							profit: Number(token.return),
							'transaction-count': {
								buy: token.buy,
								sell: token.sell,
							},
						}) satisfies Data,
				),
			};
		},
		sort({ items, sortDescriptor }) {
			return {
				items: items.sort((a, b) => {
					let first = a[sortDescriptor.column as keyof typeof a];
					let second = b[sortDescriptor.column as keyof typeof b];

					if (!first) return 1;
					if (!second) return -1;

					if (typeof first === 'string' && first.startsWith('$')) {
						first = first.slice(1);
					}
					if (typeof second === 'string' && second.startsWith('$')) {
						second = second.slice(1);
					}
					let cmp = (
						typeof first === 'string' && typeof second === 'string'
							? (parseInt(first) || first) < (parseInt(second) || second)
							: first < second
					)
						? -1
						: 1;

					if (sortDescriptor.direction === 'descending') {
						cmp *= -1;
					}

					return cmp;
				}),
			};
		},
	});

	/**
	 * This is a workaround to reload the list when the data changes.
	 */
	useEffect(() => {
		list.reload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<section className="bg-[#FFFFFF08] rounded-md p-6 flex flex-col gap-3">
			<span className="flex items-center gap-2">
				<h3 className="text-base font-normal text-[#FFFFFFA6]">{t('title')}</h3>
				<span className="text-sm font-normal text-[#FFFFFFA6]">
					{date.start} ~ {date.end}
				</span>
			</span>
			<ScrollShadow className="max-h-[calc(100vh-250px)] w-full" visibility="bottom">
				<Table
					classNames={{
						base: 'bg-transparent',
						thead: '[&>tr]:first:shadow-none',
						th: 'bg-[rgb(22,29,42)]',
						td: 'group-aria-[selected=false]/tr:group-data-[hover=true]/tr:before:bg-[#FFFFFF05] data-[selected=true]:text-white',
					}}
					removeWrapper
					selectionMode="single"
					sortDescriptor={list.sortDescriptor}
					onSortChange={descriptor => list.sort(descriptor)}
					rowHeight={40}
					isHeaderSticky
				>
					<TableHeader columns={columns}>
						{column => (
							<TableColumn
								key={column.key}
								allowsSorting={column.allowsSorting}
								className="data-[hover=true]:text-white"
							>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody emptyContent={tUtils('no-data')} isLoading={isPending} loadingContent={<Spinner />}>
						{list.items.map((item, index) => (
							<TableRow key={index}>
								{columnKey => (
									<TableCell>
										<Cell item={item} columnKey={columnKey as keyof Data} />
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollShadow>
		</section>
	);
};

export default OrderDetails;
