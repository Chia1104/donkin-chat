'use client';

import { useMemo } from 'react';

import { ScrollShadow } from '@heroui/scroll-shadow';
import { Spinner } from '@heroui/spinner';

import type { CryptoData } from '@/components/chart/ec-treemap';
import ECTreemap, { itemStyle } from '@/components/chart/ec-treemap';
import { useQueryTokensHot } from '@/libs/token/hooks/useQueryToken';
import { roundDecimal } from '@/utils/format';

const Heatmap = () => {
	const { flatData, isLoading } = useQueryTokensHot({
		page_size: 20,
		page: 1,
		sort_by: 'market_cap',
	});
	const data = useMemo(() => {
		return flatData.map(
			item =>
				({
					name: item.name,
					value: item.market_cap,
					price: `$${roundDecimal(item.price, 5)}`,
					change: roundDecimal(item.change, 5),
					itemStyle: itemStyle(item.change),
				}) satisfies CryptoData,
		);
	}, [flatData]);
	return (
		<div className="w-full h-full flex flex-col max-w-full">
			<ScrollShadow className="w-full h-[calc(100vh-156px)] max-w-full">
				{isLoading ? (
					<div className="w-full h-full flex items-center justify-center">
						<Spinner />
					</div>
				) : (
					<ECTreemap data={data} />
				)}
			</ScrollShadow>
		</div>
	);
};

export default Heatmap;
