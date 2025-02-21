'use client';

import { Tabs, Tab } from '@heroui/tabs';

const Candlestick = () => {
	return (
		<section className="border-1 border-divider p-5 aspect-[9/5] rounded-lg">
			<Tabs
				aria-label="filter time"
				size="sm"
				variant="light"
				color="primary"
				classNames={{
					tabList: 'gap-1',
					tab: 'py-1 px-2',
					cursor: 'bg-transparent border-1 border-primary/25 text-primary',
					tabContent: 'group-data-[selected=true]:text-primary',
				}}
			>
				<Tab key="6h" title="6h" />
				<Tab key="12h" title="12h" />
				<Tab key="1d" title="1d" />
				<Tab key="3d" title="3d" />
				<Tab key="7d" title="7d" />
				<Tab key="30d" title="30d" />
			</Tabs>
		</section>
	);
};

export default Candlestick;
