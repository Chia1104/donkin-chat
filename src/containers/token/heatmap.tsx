'use client';

import { useMemo } from 'react';

import { Spinner } from '@heroui/spinner';

import type { CryptoData } from '@/components/chart/ec-treemap';
import ECTreemap, { itemStyle } from '@/components/chart/ec-treemap';
import { AsyncQuery } from '@/components/commons/async-query';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { roundDecimal } from '@/utils/format';

const Heatmap = () => {
	const queryResult = useQueryTokensHot({
		page_size: 20,
		page: 1,
		sort_by: 'market_cap',
	});
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
			>
				<ECTreemap data={data} />
			</AsyncQuery>
		</div>
	);
};

export default Heatmap;
