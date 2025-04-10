'use client';

import type { ComponentPropsWithRef, CSSProperties } from 'react';

import { cn } from '@/utils/cn';

export interface ProgressSliderProps extends ComponentPropsWithRef<'div'> {
	/**
	 * 進度值 (0-100)
	 */
	value?: number;
	/**
	 * 區間數量
	 */
	segments?: number;
	/**
	 * 是否顯示進度值
	 */
	showValue?: boolean;
	/**
	 * 自訂樣式
	 */
	classNames?: {
		base?: string;
		segmentWrapper?: string;
		segment?: string;
		activeSegment?: string;
		value?: string;
	};
	colorDirection?: 'red-to-green' | 'green-to-red';
}

const ProgressSlider = ({
	value = 0,
	segments = 10,
	showValue = false,
	classNames,
	ref,
	colorDirection = 'red-to-green',
	...props
}: ProgressSliderProps) => {
	// 確保值在 0-100 範圍內
	const normalizedValue = Math.min(Math.max(value, 0), 100);
	// 計算應該有多少個激活的段落
	const activeSegments = Math.ceil((normalizedValue / 100) * segments);

	return (
		<div ref={ref} {...props} className={cn('flex flex-col gap-2 w-full', props.className, classNames?.base)}>
			<div className={cn('flex w-full gap-0.5', classNames?.segmentWrapper)}>
				{Array.from({ length: segments }).map((_, index) => {
					// 判斷此段是否為激活狀態
					const isActive = index < activeSegments;
					// 計算顏色 - 從紅色到綠色的漸變
					const segmentPosition = index / (segments - 1);
					// 計算從紅色到綠色的漸變色
					const colorStyle = isActive
						? {
								// 從紅色 (E75A5B) 到綠色 (43BB63)
								backgroundColor:
									colorDirection === 'red-to-green'
										? `rgba(${Math.round(231 - segmentPosition * (231 - 67))}, ${Math.round(
												90 + segmentPosition * (187 - 90),
											)}, ${Math.round(91 + segmentPosition * (99 - 91))}, ${isActive ? 1 : 0.35})`
										: `rgba(${Math.round(67 + segmentPosition * (231 - 67))}, ${Math.round(
												187 - segmentPosition * (187 - 90),
											)}, ${Math.round(99 - segmentPosition * (99 - 91))}, ${isActive ? 1 : 0.35})`,
							}
						: {};

					const isFirstSegment = index === 0;
					const isLastSegment = index === segments - 1;

					return (
						<div
							key={index}
							className={cn(
								'h-2 flex-1 transition-all duration-300 bg-foreground/10',
								isFirstSegment && 'rounded-l-full',
								isLastSegment && 'rounded-r-full',
								isActive && 'opacity-100',
								!isActive && 'opacity-35',
								classNames?.segment,
								isActive && classNames?.activeSegment,
							)}
							style={colorStyle as CSSProperties}
						/>
					);
				})}
			</div>
			{showValue && <span className={cn('text-sm font-medium', classNames?.value)}>{normalizedValue}%</span>}
		</div>
	);
};

export { ProgressSlider };
