'use client';

import { useMemo, memo } from 'react';

import { Avatar } from '@heroui/avatar';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import { useAsyncList } from '@react-stately/data';
import { useTranslations } from 'next-intl';

import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import dayjs from '@/utils/dayjs';
import { formatLargeNumber, roundDecimal } from '@/utils/format';
import { isNumber, isPositiveNumber } from '@/utils/is';

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
		buy: number;
		sell: number;
	};
}

const MOCK_ROWS: Data[] = [
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
	switch (columnKey) {
		case 'symbol':
			return (
				<span className="flex items-center gap-2">
					<Avatar src={item.avatar} size="sm" className="w-4 h-4" />
					{item.symbol}
				</span>
			);
		case 'amount':
			return (
				<span className="text-white">{`$${isNumber(item[columnKey]) ? formatLargeNumber(item[columnKey]) : item[columnKey]}`}</span>
			);
		case 'price':
			return (
				<span className="text-white">{`$${isNumber(item[columnKey]) ? roundDecimal(item[columnKey], 6) : item[columnKey]}`}</span>
			);
		case 'value':
			return (
				<span className="text-white">{`$${isNumber(item[columnKey]) ? roundDecimal(item[columnKey], 2) : item[columnKey]}`}</span>
			);
		case 'profit':
			return (
				<span className={isPositiveNumber(item[columnKey]) ? 'text-success' : 'text-danger'}>
					{`$${isNumber(item[columnKey]) ? roundDecimal(item[columnKey], 2) : item[columnKey]}`}
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

const OrderDetails = () => {
	const columns = useColumns();
	const [searchParams] = useAddressSearchParams();
	const t = useTranslations('address.order-details');

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
					start: dayjs().subtract(1, 'month').startOf('day').format('YYYY-MM'),
					end: dayjs().endOf('day').format('YYYY-MM'),
				};
		}
	}, [searchParams]);

	const list = useAsyncList({
		load() {
			return {
				items: MOCK_ROWS,
			};
		},
		sort({ items, sortDescriptor }) {
			return {
				items: items.sort((a, b) => {
					const first = a[sortDescriptor.column as keyof typeof a];
					const second = b[sortDescriptor.column as keyof typeof b];
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

	return (
		<section className="bg-[#FFFFFF08] rounded-md p-6 flex flex-col gap-3">
			<span className="flex items-center gap-2">
				<h3 className="text-base font-normal text-[#FFFFFFA6]">{t('title')}</h3>
				<span className="text-sm font-normal text-[#FFFFFFA6]">
					{date.start} ~ {date.end}
				</span>
			</span>
			<Table
				classNames={{
					base: 'bg-transparent',
					th: 'bg-transparent',
					td: 'group-aria-[selected=false]/tr:group-data-[hover=true]/tr:before:bg-[#FFFFFF05] data-[selected=true]:text-white',
				}}
				removeWrapper
				selectionMode="single"
				sortDescriptor={list.sortDescriptor}
				onSortChange={descriptor => list.sort(descriptor)}
			>
				<TableHeader columns={columns}>
					{column => (
						<TableColumn key={column.key} allowsSorting={column.allowsSorting} className="data-[hover=true]:text-white">
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody emptyContent="No data" items={list.items}>
					{item => (
						<TableRow key={item.symbol}>
							{columnKey => (
								<TableCell>
									<Cell item={item} columnKey={columnKey as keyof Data} />
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</section>
	);
};

export default OrderDetails;
