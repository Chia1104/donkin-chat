'use client';

import { useMemo } from 'react';

import { Spinner } from '@heroui/spinner';

import type { CryptoData } from '@/components/chart/ec-treemap';
import ECTreemap, { itemStyle, MOCK_DATA } from '@/components/chart/ec-treemap';
import { AsyncQuery } from '@/components/commons/async-query';
import { useGlobalSearchParams } from '@/hooks/useGlobalSearchParams';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { roundDecimal } from '@/utils/format';

const Heatmap = () => {
	const [searchParams] = useGlobalSearchParams();
	const queryResult = useQueryTokensHot(
		{
			page_size: 20,
			page: 1,
			sort_by: 'hot',
		},
		{
			enabled: !searchParams.mock,
		},
	);
	const data = useMemo(() => {
		return queryResult.flatData.map(
			item =>
				({
					name: item.name,
					symbol: item.symbol,
					value: item.market_cap,
					price: `$${roundDecimal(item.price, 5)}`,
					change: roundDecimal(item.change, 5),
					itemStyle: itemStyle(item.change),
				}) satisfies CryptoData,
		);
	}, [queryResult.flatData]);
	return (
		<div className="w-full h-[calc(100vh-156px)] flex flex-col max-w-full">
			<AsyncQuery
				queryResult={queryResult}
				loadingFallback={
					<div className="w-full h-full flex items-center justify-center">
						<Spinner />
					</div>
				}
				enable={!searchParams.mock}
			>
				<ECTreemap data={searchParams.mock ? MOCK_DATA : data} />
			</AsyncQuery>
		</div>
	);
};

export default Heatmap;
