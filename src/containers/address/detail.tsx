'use client';

import { useMemo } from 'react';

import { Spinner } from '@heroui/spinner';
import type { Time } from 'lightweight-charts';
import { useParams } from 'next/navigation';

import OrderDetails from '@/components/address/order-details';
import type { OrderHistoryDataItem, OrderHistoryProps } from '@/components/address/order-history';
import OrderHistory from '@/components/address/order-history';
import { AsyncQuery } from '@/components/commons/async-query';
import { ErrorBoundary } from '@/components/commons/error-boundary';
import { useGlobalSearchParams } from '@/hooks/useGlobalSearchParams';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import { useQueryAddress } from '@/libs/address/hooks/useQueryAddress';
import dayjs from '@/utils/dayjs';
import { isPositiveNumber } from '@/utils/is';

const MOCK_DATA = {
	meta: {
		winRate: 99.6,
		profitRate: 15.92,
		profitAmount: '(+$4M)',
	},
	balanceData: Array.from({ length: 30 }, (_, i) => {
		const date = dayjs().subtract(30 - i, 'day');
		return {
			time: date.unix() as Time,
			value: 5000 + Math.floor(Math.random() * 5000),
		};
	}),
	profitLossData: Array.from({ length: 30 }, (_, i) => {
		const date = dayjs().subtract(30 - i, 'day');
		const isProfit = Math.random() > 0.3;
		return {
			time: date.unix() as Time,
			value: isProfit ? Math.floor(Math.random() * 4000) : -Math.floor(Math.random() * 1000),
			isProfit,
		};
	}),
};

const Detail = () => {
	const params = useParams<{ chain: string; address: string }>();
	const [searchParams] = useAddressSearchParams();
	const [globalSearchParams] = useGlobalSearchParams();

	const queryResult = useQueryAddress(
		{
			address: params.address,
			interval: searchParams.interval,
			timeout: 60_000,
			include_transactions: true,
		},
		{
			enabled: !globalSearchParams.mock,
		},
	);

	const balanceData: OrderHistoryDataItem[] = useMemo(() => {
		if (globalSearchParams.mock) {
			return MOCK_DATA.balanceData;
		}

		if (!queryResult.data) {
			return [];
		}

		return queryResult.data.daily_data.map(item => ({
			time: dayjs(item.date).unix() as Time,
			value: Number(item.balance_usd),
			tokens: item.token_pnls,
		}));
	}, [queryResult.data, globalSearchParams.mock]);

	const profitLossData: OrderHistoryDataItem[] = useMemo(() => {
		if (globalSearchParams.mock) {
			return MOCK_DATA.profitLossData;
		}

		if (!queryResult.data) {
			return [];
		}

		return queryResult.data.daily_data.map(item => ({
			time: dayjs(item.date).unix() as Time,
			value: Number(item.daily_return),
			isProfit: isPositiveNumber(Number(item.daily_return_rate)),
			tokens: item.token_pnls,
		}));
	}, [queryResult.data, globalSearchParams.mock]);

	const orderHistoryProps: Pick<OrderHistoryProps, 'meta' | 'win' | 'profit'> = useMemo(() => {
		if (globalSearchParams.mock) {
			return {
				meta: {
					avatar: '',
					address: params.address,
					volume: 1523268,
					profit: '-0.87',
				},
				win: {
					rate: 99.6,
				},
				profit: {
					rate: 15.92,
					amount: 4000000,
				},
			};
		}

		return {
			meta: queryResult.data
				? {
						avatar: '',
						address: params.address,
						volume: queryResult.data.balance_usd,
						profit: queryResult.data.daily_return_rate,
					}
				: undefined,
			win: queryResult.data
				? {
						rate: queryResult.data.win_rate ?? '-',
					}
				: undefined,
			profit: queryResult.data
				? {
						rate: queryResult.data.daily_return_rate,
						amount: queryResult.data.daily_return,
					}
				: undefined,
		};
	}, [queryResult.data, params.address, globalSearchParams.mock]);

	return (
		<div className="w-full h-full flex flex-col">
			<AsyncQuery
				queryResult={queryResult}
				isInfinite={false}
				loadingFallback={
					<div className="w-full h-[calc(100vh-72px)] flex items-center justify-center">
						<Spinner />
					</div>
				}
				enable={false}
			>
				<div className="flex flex-col gap-10 w-full">
					<ErrorBoundary>
						<OrderHistory
							{...orderHistoryProps}
							balanceData={balanceData}
							profitLossData={profitLossData}
							isPending={queryResult.isLoading}
							isMetaPending={queryResult.isLoading}
						/>
					</ErrorBoundary>
					<ErrorBoundary>
						<OrderDetails data={queryResult.data} mock={globalSearchParams.mock} isPending={queryResult.isLoading} />
					</ErrorBoundary>
				</div>
			</AsyncQuery>
		</div>
	);
};

export default Detail;
