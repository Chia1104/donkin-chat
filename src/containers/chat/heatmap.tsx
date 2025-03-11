'use client';

import { ScrollShadow } from '@heroui/scroll-shadow';

import ECTreemap, { MOCK_DATA } from '@/components/chart/ec-treemap';

const Heatmap = () => {
	return (
		<div className="w-full h-full flex flex-col max-w-full">
			<ScrollShadow className="w-full h-[calc(100vh-156px)] max-w-full">
				<ECTreemap data={MOCK_DATA} />
			</ScrollShadow>
		</div>
	);
};

export default Heatmap;
