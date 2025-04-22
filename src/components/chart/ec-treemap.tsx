'use client';

import { useMemo, useRef, useState, useCallback, useEffect, forwardRef } from 'react';

import type { TreemapSeriesOption, EChartsOption, ECElementEvent, DefaultLabelFormatterCallbackParams } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { createPortal } from 'react-dom';

import { useAskToken } from '@/libs/ai/hooks/useAskToken';
import { isPositiveNumber, isNegativeNumber, isString } from '@/utils/is';

import DonkinPopover from '../donkin/popover';

export interface CryptoData {
	name: string;
	symbol: string;
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
		symbol: 'BTC',
		value: [1000, 5.46],
		price: '$99,299.9',
		change: 5.46,
		itemStyle: itemStyle(5.46),
	},
	{
		name: 'ETH',
		symbol: 'ETH',
		value: [500, -18.46],
		price: '$2,299.9',
		change: -18.46,
		itemStyle: itemStyle(-18.46),
	},
	{
		name: 'XRP',
		symbol: 'XRP',
		value: [200, 2.46],
		price: '$2.9987',
		change: 2.46,
		itemStyle: itemStyle(2.46),
	},
	{
		name: 'SOL',
		symbol: 'SOL',
		value: [200, -10.46],
		price: '$190.47',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'BNB',
		symbol: 'BNB',
		value: [180, -0.46],
		price: '$641.47',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'DOGE',
		symbol: 'DOGE',
		value: [120, -10.46],
		price: '$0.2513',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'ADA',
		symbol: 'ADA',
		value: [100, -0.46],
		price: '$0.7731',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'TRX',
		symbol: 'TRX',
		value: [80, 10.46],
		price: '$0.2409',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'LINK',
		symbol: 'LINK',
		value: [80, 5.46],
		price: '$17.47',
		change: 5.46,
		itemStyle: itemStyle(5.46),
	},
	{
		name: 'AVAX',
		symbol: 'AVAX',
		value: [70, -5.46],
		price: '$24.72',
		change: -5.46,
		itemStyle: itemStyle(-5.46),
	},
	{
		name: 'SUI',
		symbol: 'SUI',
		value: [60, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'XLM',
		symbol: 'XLM',
		value: [60, 10.46],
		price: '$0.3189',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'UNI',
		symbol: 'UNI',
		value: [50, 10.46],
		price: '$9.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		value: [50, -10.46],
		price: '$0.99',
		change: -10.46,
		itemStyle: itemStyle(-10.46),
	},
	{
		name: 'SHIB',
		symbol: 'SHIB',
		value: [40, 15.46],
		price: '$0.00000916',
		change: 15.46,
		itemStyle: itemStyle(15.46),
	},
	{
		name: 'DOT',
		symbol: 'DOT',
		value: [40, -0.46],
		price: '$4.87',
		change: -0.46,
		itemStyle: itemStyle(-0.46),
	},
	{
		name: 'ONDO',
		symbol: 'ONDO',
		value: [30, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'TRUMP',
		symbol: 'TRUMP',
		value: [30, 10.46],
		price: '$1.47',
		change: 10.46,
		itemStyle: itemStyle(10.46),
	},
	{
		name: 'PEPE',
		symbol: 'PEPE',
		value: [20, -5.46],
		price: '$0.00000976',
		change: -5.46,
		itemStyle: itemStyle(-5.46),
	},
	{
		name: 'CKB',
		symbol: 'CKB',
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
	const askToken = useAskToken(data.symbol);

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

	const handleChartClick = useCallback((params: ECElementEvent) => {
		if (params.componentType === 'series') {
			const domEvent = params.event?.event;
			if (domEvent?.zrX && domEvent?.zrY) {
				setTooltipInfo({
					data: params.data as CryptoData,
					position: { x: domEvent.zrX + 20, y: domEvent.zrY + 20 },
				});
			}
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
			dataZoom: {
				type: 'inside',
			},
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
						formatter: (params: DefaultLabelFormatterCallbackParams) => {
							let sizeType = 'normal';
							if (params.dataIndex > 12) {
								sizeType = 'tiny';
							} else if (params.dataIndex > 8) {
								sizeType = 'small';
							} else if (params.dataIndex > 4) {
								sizeType = 'medium';
							}

							const data = params.data as CryptoData;

							const isPositive = Number(data.change) > 0;

							return [
								`{${sizeType}Name|${params.name}}`,
								`{${sizeType}Price|${data.price}}`,
								`{${isPositive ? `${sizeType}ChangePositive` : `${sizeType}ChangeNegative`}|${Number(data.change) > 0 ? '+' : ''}${data.change}%}`,
							].join('\n');
						},
						rich: {
							normalName: {
								fontSize: 32,
								color: '#fff',
								padding: [20, 2, 2, 10],
							},
							mediumName: {
								fontSize: 24,
								color: '#fff',
								padding: [18, 2, 2, 9],
							},
							smallName: {
								fontSize: 16,
								color: '#fff',
								padding: [15, 2, 2, 8],
							},
							tinyName: {
								fontSize: 12,
								color: '#fff',
								padding: [12, 2, 2, 6],
							},
							normalPrice: {
								fontSize: 16,
								color: '#fff',
								padding: [5, 2, 2, 10],
							},
							mediumPrice: {
								fontSize: 14,
								color: '#fff',
								padding: [5, 2, 2, 9],
							},
							smallPrice: {
								fontSize: 10,
								color: '#fff',
								padding: [4, 2, 2, 8],
							},
							tinyPrice: {
								fontSize: 7,
								color: '#fff',
								padding: [3, 2, 2, 6],
							},
							normalChangePositive: {
								fontSize: 16,
								padding: [5, 2, 2, 10],
								color: 'rgba(56, 175, 117, 1)',
							},
							normalChangeNegative: {
								fontSize: 16,
								padding: [5, 2, 2, 10],
								color: 'rgba(231, 90, 91, 1)',
							},
							mediumChangePositive: {
								fontSize: 14,
								padding: [5, 2, 2, 9],
								color: 'rgba(56, 175, 117, 1)',
							},
							mediumChangeNegative: {
								fontSize: 14,
								padding: [5, 2, 2, 9],
								color: 'rgba(231, 90, 91, 1)',
							},
							smallChangePositive: {
								fontSize: 10,
								padding: [4, 2, 2, 8],
								color: 'rgba(56, 175, 117, 1)',
							},
							smallChangeNegative: {
								fontSize: 10,
								padding: [4, 2, 2, 8],
								color: 'rgba(231, 90, 91, 1)',
							},
							tinyChangePositive: {
								fontSize: 7,
								padding: [3, 2, 2, 6],
								color: 'rgba(56, 175, 117, 1)',
							},
							tinyChangeNegative: {
								fontSize: 7,
								padding: [3, 2, 2, 6],
								color: 'rgba(231, 90, 91, 1)',
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
