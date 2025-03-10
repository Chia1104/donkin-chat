'use client';

import { ScrollShadow } from '@heroui/scroll-shadow';
import { useTranslations } from 'next-intl';

import { D3Treemap } from '@/components/chart/d3-treemap';

const Heatmap = () => {
	const t = useTranslations('preview.tree-map');
	return (
		<div className="w-full h-full flex flex-col max-w-full">
			<header className="flex items-center justify-between p-4">
				<h2 className="text-2xl font-bold">{t('title')}</h2>
			</header>
			<ScrollShadow className="w-full h-[calc(100vh-156px)] max-w-full">
				<D3Treemap
					width={1000}
					height={1000}
					data={{
						type: 'node',
						name: 'boss',
						value: 0,
						children: [
							{
								type: 'node',
								name: 'Team Dataviz',
								value: 0,
								children: [
									{ type: 'leaf', name: 'Mark', value: 90 },
									{ type: 'leaf', name: 'Robert', value: 12 },
									{ type: 'leaf', name: 'Emily', value: 34 },
									{ type: 'leaf', name: 'Marion', value: 53 },
								],
							},
							{
								type: 'node',
								name: 'Team DevOps',
								value: 0,
								children: [
									{ type: 'leaf', name: 'Nicolas', value: 98 },
									{ type: 'leaf', name: 'Malki', value: 22 },
									{ type: 'leaf', name: 'Djé', value: 12 },
								],
							},
							{
								type: 'node',
								name: 'Team Sales',
								value: 0,
								children: [
									{ type: 'leaf', name: 'Mélanie', value: 45 },
									{ type: 'leaf', name: 'Einstein', value: 76 },
								],
							},
						],
					}}
				/>
			</ScrollShadow>
		</div>
	);
};

export default Heatmap;
