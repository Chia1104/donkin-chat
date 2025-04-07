'use client';

import { useMemo } from 'react';

import { ScrollShadow } from '@heroui/scroll-shadow';
import type { Time } from 'lightweight-charts';
import { useParams } from 'next/navigation';

import OrderDetails from '@/components/address/order-details';
import type { OrderHistoryDataItem } from '@/components/address/order-history';
import OrderHistory from '@/components/address/order-history';
import { AsyncQuery } from '@/components/commons/async-query';
import { ErrorBoundary } from '@/components/commons/error-boundary';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import { useQueryAddress } from '@/libs/address/hooks/useQueryAddress';
import dayjs from '@/utils/dayjs';
import { isPositiveNumber } from '@/utils/is';

const _mockData = {
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

	const queryResult = useQueryAddress({
		address: params.address,
		interval: searchParams.interval,
	});

	const balanceData: OrderHistoryDataItem[] = useMemo(() => {
		if (!queryResult.data) {
			return [];
		}

		return queryResult.data.daily_data.map(item => ({
			time: item.date,
			value: Number(item.balance_usd),
		}));
	}, [queryResult.data]);

	const profitLossData: OrderHistoryDataItem[] = useMemo(() => {
		if (!queryResult.data) {
			return [];
		}

		return queryResult.data.daily_data.map(item => ({
			time: item.date,
			value: Number(item.daily_return),
			isProfit: isPositiveNumber(Number(item.daily_return_rate)),
		}));
	}, [queryResult.data]);

	return (
		<div className="w-full h-full flex flex-col">
			<AsyncQuery queryResult={queryResult} isInfinite={false}>
				{({ data }) =>
					data && (
						<ScrollShadow className="w-full h-[calc(100vh-72px)]">
							<div className="flex flex-col gap-10 w-full">
								<ErrorBoundary>
									<OrderHistory
										meta={{
											avatar: '',
											address: params.address,
											volume: Number(data.balance_usd),
											profit: data.daily_return_rate.toString(),
										}}
										win={{
											rate: Number(data.win_rate),
										}}
										profit={{
											rate: data.daily_return_rate,
											amount: Number(data.daily_return),
										}}
										balanceData={balanceData}
										profitLossData={profitLossData}
										isPending={false}
										isMetaPending={false}
									/>
								</ErrorBoundary>
								<ErrorBoundary>
									<OrderDetails data={data} />
								</ErrorBoundary>
							</div>
						</ScrollShadow>
					)
				}
			</AsyncQuery>
		</div>
	);
};

export default Detail;
