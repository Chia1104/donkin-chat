'use client';

import { useEffect, useCallback } from 'react';

import type { LogicalRange } from 'lightweight-charts';

import { useChart } from './chart';

interface Props {
	method: (range: number) => void | Promise<void>;
	enabled?: boolean;
}

export const SubscribeVisibleLogicalRange = ({ method, enabled = true }: Props) => {
	const chart = useChart();

	const handleSubscribeVisibleLogicalRangeChange = useCallback(
		(logicalRange: LogicalRange | null) => {
			if (!logicalRange || !enabled) {
				return;
			}
			if (logicalRange.from < 10) {
				void method(logicalRange.from);
			}
		},
		[enabled, method],
	);

	useEffect(() => {
		const api = chart.api();
		api.timeScale().subscribeVisibleLogicalRangeChange(handleSubscribeVisibleLogicalRangeChange);

		return () => {
			api.timeScale().unsubscribeVisibleLogicalRangeChange(handleSubscribeVisibleLogicalRangeChange);
		};
	}, [chart, enabled, handleSubscribeVisibleLogicalRangeChange]);

	return null;
};
