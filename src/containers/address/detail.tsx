'use client';

import { ScrollShadow } from '@heroui/scroll-shadow';
import type { Time } from 'lightweight-charts';
import { useParams } from 'next/navigation';

import OrderDetails from '@/components/address/order-details';
import OrderHistory from '@/components/address/order-history';
import { ErrorBoundary } from '@/components/commons/error-boundary';
import dayjs from '@/utils/dayjs';

const mockData = {
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

	return (
		<div className="w-full h-full flex flex-col">
			<ScrollShadow className="w-full h-[calc(100vh-72px)]">
				<div className="flex flex-col gap-10 w-full">
					<ErrorBoundary>
						<OrderHistory
							meta={{
								avatar: '',
								address: params.address,
								volume: 1523268,
								profit: '-0.87',
							}}
							win={{
								rate: 99.6,
								amount: 4000000,
							}}
							profit={{
								rate: 15.92,
								amount: 4000000,
							}}
							balanceData={mockData.balanceData}
							profitLossData={mockData.profitLossData}
							isPending={false}
							isMetaPending={false}
						/>
					</ErrorBoundary>
					<ErrorBoundary>
						<OrderDetails />
					</ErrorBoundary>
				</div>
			</ScrollShadow>
		</div>
	);
};

export default Detail;
