'use client';

import { useMemo, useRef, useState, useCallback, useEffect, forwardRef } from 'react';

import type { TreemapSeriesOption, EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { createPortal } from 'react-dom';

import { useAskToken } from '@/libs/ai/hooks/useAskToken';
import { isPositiveNumber, isNegativeNumber, isString } from '@/utils/is';

import DonkinPopover from '../donkin/popover';

export interface CryptoData {
	name: string;
	value: number | number[];
	price: string;
	change: string | number;
	children?: CryptoData[];
	itemStyle?: TreemapSeriesOption['itemStyle'];
}

interface Props {
	data: CryptoData[];
	options?: EChartsOption;
}

export const itemStyle = (value: unknown): TreemapSeriesOption['itemStyle'] => {
	if (isPositiveNumber(value) || (isString(value) && value.startsWith('+'))) {
		return {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{ offset: 0, color: '#21424100' },
					{ offset: 1, color: '#214241' },
				],
			},
		};
	}
	if (isNegativeNumber(value) || (isString(value) && value.startsWith('-'))) {
		return {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{ offset: 0, color: '#48223100' },
					{ offset: 1, color: '#482231' },
				],
			},
		};
	}
	return {
		color: '#aaa',
	};
};

export const MOCK_DATA: CryptoData[] = [
	{
		name: 'BTC',
		value: [1000, 5.46],
		price: '$99,299.9',
		change: 5.46,
		itemStyle: itemStyle(5.46),
	},
	{
		name: 'ETH',
		value: [500, -18.46],
		price: '$2,299.9',
		change: -18.46,
		itemStyle: itemStyle(-18.46),
	},
	{
		name: 'XRP',
		value: [200, 2.46],
		price: '$2.9987',
		change: 2.46,
		itemStyle: itemStyle(2.46),
	},
	{
		name: 'SOL',
		value: [200, -10.46],
		price: '$190.47',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'BNB',
		value: [180, -0.46],
		price: '$641.47',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'DOGE',
		value: [120, -10.46],
		price: '$0.2513',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'ADA',
		value: [100, -0.46],
		price: '$0.7731',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'TRX',
		value: [80, 10.46],
		price: '$0.2409',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'LINK',
		value: [80, 5.46],
		price: '$17.47',
		change: 5.46,
		itemStyle: itemStyle(5.46),
	},
	{
		name: 'AVAX',
		value: [70, -5.46],
		price: '$24.72',
		change: -5.46,
		itemStyle: itemStyle(-5.46),
	},
	{
		name: 'SUI',
		value: [60, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'XLM',
		value: [60, 10.46],
		price: '$0.3189',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'UNI',
		value: [50, 10.46],
		price: '$9.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'DAI',
		value: [50, -10.46],
		price: '$0.99',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'SHIB',
		value: [40, 15.46],
		price: '$0.00000916',
		change: 15.46,
		itemStyle: itemStyle(15.46),
	},
	{
		name: 'DOT',
		value: [40, -0.46],
		price: '$4.87',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'ONDO',
		value: [30, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'TRUMP',
		value: [30, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'PEPE',
		value: [20, -5.46],
		price: '$0.00000976',
		change: -5.46,
		itemStyle: itemStyle(-5.46),
	},
	{
		name: 'CKB',
		value: [20, 5.46],
		price: '$0.47',
		change: 5.46,
		itemStyle: itemStyle(5.46),
	},
];

interface TooltipProps {
	data: CryptoData;
	position: { x: number; y: number };
	onClose: () => void;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({ data, position, onClose }, ref) => {
	const askToken = useAskToken(data.name);

	// 調整位置以確保 tooltip 不會超出螢幕邊界
	const adjustedPosition = useMemo(() => {
		const tooltipWidth = 220;
		const tooltipHeight = 210;

		// 獲取視窗大小
		const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
		const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

		// 計算調整後的位置
		let adjustedX = position.x;
		let adjustedY = position.y;

		// 檢查右邊界
		if (position.x + tooltipWidth > windowWidth) {
			adjustedX = windowWidth - tooltipWidth - 10; // 保留10px邊距
		}

		// 檢查下邊界
		if (position.y + tooltipHeight > windowHeight) {
			adjustedY = windowHeight - tooltipHeight - 10; // 保留10px邊距
		}

		// 確保不超出左邊界和上邊界
		adjustedX = Math.max(10, adjustedX);
		adjustedY = Math.max(10, adjustedY);

		return { x: adjustedX, y: adjustedY };
	}, [position]);

	return createPortal(
		<DonkinPopover
			ref={ref}
			onClose={onClose}
			style={{ position: 'absolute', top: adjustedPosition.y, left: adjustedPosition.x }}
			{...askToken}
		/>,
		document.body,
	);
});

const ECTreemap = (props: Props) => {
	const [tooltipInfo, setTooltipInfo] = useState<{ data: CryptoData; position: { x: number; y: number } } | null>(null);
	const chartRef = useRef<ReactECharts>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const handleChartClick = useCallback((params: any) => {
		if (params.componentType === 'series') {
			const domEvent = params.event.event;
			setTooltipInfo({
				data: params.data,
				position: { x: domEvent.clientX, y: domEvent.clientY },
			});
		}
	}, []);

	const handleCloseTooltip = useCallback(() => {
		setTooltipInfo(null);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!tooltipInfo || !containerRef.current) return;

			// 檢查滑鼠是否在圖表容器範圍內
			const containerRect = containerRef.current.getBoundingClientRect();
			const isInside =
				e.clientX >= containerRect.left &&
				e.clientX <= containerRect.right &&
				e.clientY >= containerRect.top &&
				e.clientY <= containerRect.bottom;

			if (tooltipRef.current) {
				const tooltipRect = tooltipRef.current.getBoundingClientRect();
				const isInside =
					e.clientX >= tooltipRect.left &&
					e.clientX <= tooltipRect.right &&
					e.clientY >= tooltipRect.top &&
					e.clientY <= tooltipRect.bottom;
				if (isInside) {
					return;
				}
			}

			// 如果滑鼠不在容器內，關閉 tooltip
			if (!isInside) {
				handleCloseTooltip();
			}
		},
		[tooltipInfo, handleCloseTooltip],
	);

	useEffect(() => {
		if (tooltipInfo) {
			window.addEventListener('mousemove', handleMouseMove);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [tooltipInfo, handleMouseMove]);

	const onEvents = useMemo(() => {
		return {
			click: handleChartClick,
		};
	}, [handleChartClick]);

	const options = useMemo(() => {
		return {
			tooltip: {
				show: false,
			},
			series: [
				{
					type: 'treemap',
					data: props.data,
					width: '100%',
					height: '100%',
					roam: false,
					nodeClick: false,
					breadcrumb: {
						show: false,
					},
					visualMin: -20,
					visualMax: 20,
					visualDimension: 2,
					label: {
						show: true,
						formatter: (params: any) => {
							return [
								`{name|${params.name}}`,
								`{price|${params.data.price}}`,
								`{change|${params.data.change > 0 ? '+' : ''}${params.data.change}%}`,
							].join('\n');
						},
						rich: {
							name: {
								fontSize: 24,
								fontWeight: 'bold',
								color: '#fff',
								padding: [20, 2, 2, 10],
							},
							price: {
								fontSize: 14,
								color: '#fff',
								padding: [5, 2, 2, 10],
							},
							change: {
								fontSize: 14,
								padding: [5, 2, 2, 10],
								color: '#fff',
							},
						},
					},
					itemStyle: {
						borderColor: 'transparent',
					},
				},
			],
			...props.options,
		} satisfies EChartsOption;
	}, [props.data, props.options]);

	return (
		<div ref={containerRef} className="w-full h-full relative">
			<ReactECharts
				ref={chartRef}
				option={options}
				style={{ height: '100%', width: '100%' }}
				opts={{ renderer: 'canvas' }}
				className="bg-transparent"
				onEvents={onEvents}
			/>
			{tooltipInfo && (
				<Tooltip
					ref={tooltipRef}
					data={tooltipInfo.data}
					position={tooltipInfo.position}
					onClose={handleCloseTooltip}
				/>
			)}
		</div>
	);
};

export default ECTreemap;
