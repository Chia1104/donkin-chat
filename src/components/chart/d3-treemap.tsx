'use client';

import { useMemo } from 'react';

import * as d3 from 'd3';

import { cn } from '@/utils/cn';

import styles from './d3-treemap.module.css';

export interface TreeNode {
	type: 'node';
	value: number;
	name: string;
	children: Tree[];
}
export interface TreeLeaf {
	type: 'leaf';
	name: string;
	value: number;
}

export type Tree = TreeNode | TreeLeaf;

interface TreemapProps {
	width: number;
	height: number;
	data: Tree;
	classNames?: {
		wrapper?: string;
		container?: string;
		rectangle?: string;
	};
}

const colors = ['#e0ac2b', '#6689c6', '#a4c969', '#e85252', '#9a6fb0', '#a53253', '#7f7f7f'];

export const D3Treemap = ({ width, height, data, classNames }: TreemapProps) => {
	const hierarchy = useMemo(() => {
		return d3.hierarchy(data).sum(d => d.value);
	}, [data]);

	// List of item of level 1 (just under root) & related color scale
	const firstLevelGroups = hierarchy?.children?.map(child => child.data.name);
	const colorScale = d3
		.scaleOrdinal<string>()
		.domain(firstLevelGroups || [])
		.range(colors);

	const root = useMemo(() => {
		const treeGenerator = d3.treemap<Tree>().tile(d3.treemapSquarify).size([width, height]).padding(2);
		return treeGenerator(hierarchy);
	}, [hierarchy, width, height]);

	const allShapes = root.leaves().map((leaf, i) => {
		const parentName = leaf.parent?.data.name;
		return (
			<g
				key={`${leaf.id}-${i}`}
				className={cn(styles.rectangle, classNames?.rectangle)}
				onClick={() => {
					console.log(leaf);
				}}
			>
				<rect
					x={leaf.x0}
					y={leaf.y0}
					width={leaf.x1 - leaf.x0}
					height={leaf.y1 - leaf.y0}
					stroke="transparent"
					fill={parentName ? colorScale(parentName) : undefined}
					className={'opacity-80 hover:opacity-100'}
				/>
				<text
					x={leaf.x0 + 3}
					y={leaf.y0 + 3}
					fontSize={12}
					textAnchor="start"
					alignmentBaseline="hanging"
					fill="white"
					className="font-bold"
				>
					{leaf.data.name}
				</text>
				<text
					x={leaf.x0 + 3}
					y={leaf.y0 + 18}
					fontSize={12}
					textAnchor="start"
					alignmentBaseline="hanging"
					fill="white"
					className="font-light"
				>
					{leaf.data.value}
				</text>
			</g>
		);
	});

	return (
		<div className={cn('w-full', classNames?.wrapper)}>
			<svg
				viewBox="[0, 0, width, height]"
				width={width}
				height={height}
				className={cn('max-w-full h-auto', styles.container, classNames?.container)}
			>
				{allShapes}
			</svg>
		</div>
	);
};
