'use client';

import { useTranslations } from 'next-intl';

import ClickableMarkerDemo from '@/components/chart/trading-chart/plugins/clickable-marker/demo';

export default function ChartExamplesPage() {
	const t = useTranslations('ChartExamples');

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

			<div className="bg-gray-900 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-bold mb-4">可點擊標記</h2>
				<p className="mb-4 text-gray-300">這個範例展示了如何在圖表上添加互動標記，點擊標記會顯示詳細資訊。</p>

				<div className="w-full">
					<ClickableMarkerDemo />
				</div>
			</div>
		</div>
	);
}
