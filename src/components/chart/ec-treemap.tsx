'use client';

import { useMemo } from 'react';

import type { TreemapSeriesOption } from 'echarts';
import type { EChartsOption } from 'echarts-for-react';
import ReactECharts from 'echarts-for-react';

import { isPositiveNumber, isNegativeNumber } from '@/utils/is';

export interface CryptoData {
	name: string;
	value: number | number[];
	price: string;
	change: number;
	children?: CryptoData[];
	itemStyle?: TreemapSeriesOption['itemStyle'];
}

interface Props {
	data: CryptoData[];
	options?: EChartsOption;
}

const itemStyle = (value: unknown): TreemapSeriesOption['itemStyle'] => {
	if (isPositiveNumber(value)) {
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
	if (isNegativeNumber(value)) {
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

const ECTreemap = (props: Props) => {
	const options: EChartsOption = useMemo(() => {
		return {
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
		<ReactECharts
			option={options}
			style={{ height: '100%', width: '100%' }}
			opts={{ renderer: 'canvas' }}
			className="bg-transparent"
		/>
	);
};

export default ECTreemap;
