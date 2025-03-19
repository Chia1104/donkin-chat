'use client';

import React, { useMemo } from 'react';

import type { CandlestickData, Time } from 'lightweight-charts';
import { useTranslations } from 'next-intl';

import CandlestickChart from '@/components/chart/candlestick-chart';
import ClickableMarkerDemo from '@/components/chart/plugins/clickable-marker/demo';

export default function ChartExamplesPage() {
	const t = useTranslations('ChartExamples');

	// 生成模擬的 K 線圖數據
	const candlestickData = useMemo(() => {
		const basePrice = 100;
		const data: CandlestickData<Time>[] = [];
		const nowTimestamp = Math.floor(Date.now() / 1000);
		const daySeconds = 24 * 60 * 60;

		// 生成過去 30 天的模擬數據
		for (let i = 30; i >= 0; i--) {
			const time = nowTimestamp - i * daySeconds;
			const volatility = 0.2;

			let open;

			if (i === 30) {
				open = basePrice;
			} else {
				open = data[data.length - 1].close;
			}

			const change = open * (Math.random() * volatility * 2 - volatility);
			const close = open + change;

			const high = Math.max(open, close) * (1 + Math.random() * 0.1);
			const low = Math.min(open, close) * (1 - Math.random() * 0.1);

			data.push({
				time: time as Time,
				open,
				high,
				low,
				close,
			});
		}

		return data;
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

			<div className="bg-gray-900 rounded-lg p-6 mb-8">
				<h2 className="text-xl font-bold mb-4">{t('candlestickTitle')}</h2>
				<p className="mb-4 text-gray-300">{t('candlestickDescription')}</p>

				<div className="w-full">
					<CandlestickChart data={candlestickData} height={500} className="w-full rounded-lg overflow-hidden" />
				</div>
			</div>

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
