'use client';

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

export const D3Treemap = ({ width, height, data, classNames }: TreemapProps) => {
	const hierarchy = d3.hierarchy(data).sum(d => d.value);

	const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
	const root = treeGenerator(hierarchy);

	const allShapes = root.leaves().map((leaf, index) => {
		return (
			<g key={`${leaf.id}-${index}`}>
				<rect
					x={leaf.x0}
					y={leaf.y0}
					width={leaf.x1 - leaf.x0}
					height={leaf.y1 - leaf.y0}
					stroke="transparent"
					fill={'#69b3a2'}
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
