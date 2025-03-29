'use client';

import { useEffect, useCallback } from 'react';

import type { LogicalRange } from 'lightweight-charts';

import { useChart } from './chart';

interface Props {
	method: (range: number) => void | Promise<void>;
}

export const SubscribeVisibleLogicalRange = ({ method }: Props) => {
	const chart = useChart();

	const handleSubscribeVisibleLogicalRangeChange = useCallback(
		(logicalRange: LogicalRange | null) => {
			if (!logicalRange) {
				return;
			}
			if (logicalRange.from < 10) {
				void method(logicalRange.from);
			}
		},
		[method],
	);

	useEffect(() => {
		if (!chart._api) {
			return;
		}
		chart._api.timeScale().subscribeVisibleLogicalRangeChange(handleSubscribeVisibleLogicalRangeChange);
	}, [chart._api, handleSubscribeVisibleLogicalRangeChange]);

	return null;
};
