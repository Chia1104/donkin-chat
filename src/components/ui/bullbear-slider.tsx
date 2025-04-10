'use client';

import type { ComponentPropsWithRef, CSSProperties } from 'react';

import { cn } from '@/utils/cn';

export interface BullBearSliderProps extends ComponentPropsWithRef<'div'> {
	/**
	 * 看漲百分比 (0-100)
	 */
	bullValue?: number;
	/**
	 * 看跌百分比 (0-100)
	 */
	bearValue?: number;
	/**
	 * 區間數量
	 */
	segments?: number;
	/**
	 * 是否顯示百分比值
	 */
	showValues?: boolean;
	/**
	 * 自訂樣式
	 */
	classNames?: {
		base?: string;
		segmentWrapper?: string;
		bullSegment?: string;
		bearSegment?: string;
		valuesWrapper?: string;
		bullValue?: string;
		bearValue?: string;
	};
}

const BullBearSlider = ({
	bullValue = 0,
	bearValue = 0,
	segments = 10,
	showValues = false,
	className,
	classNames,
	ref,
	...props
}: BullBearSliderProps) => {
	// 確保總和為 100
	const total = bullValue + bearValue;
	const normalizedBullValue = Math.round((bullValue / total) * 100);
	const normalizedBearValue = 100 - normalizedBullValue;

	return (
		<div ref={ref} className={cn('flex flex-col gap-2 w-full', className, classNames?.base)} {...props}>
			<div className={cn('flex w-full gap-0.5', classNames?.segmentWrapper)}>
				{Array.from({ length: segments }).map((_, index) => {
					// 計算每個段的位置百分比
					const segmentPosition = ((index + 0.5) / segments) * 100;
					// 判斷此段屬於看漲還是看跌區域
					const isBull = segmentPosition <= normalizedBullValue;
					// 距離中心點的距離，用於計算透明度
					const distanceFromCenter = Math.abs(50 - segmentPosition) / 50;
					// 強度根據距離中心遞增
					const intensity = 0.35 + distanceFromCenter * 0.65;

					const allZero = bullValue === 0 && bearValue === 0;

					const isFirstSegment = index === 0;
					const isLastSegment = index === segments - 1;

					return (
						<div
							key={index}
							className={cn(
								'h-2 flex-1 transition-all duration-300',
								isBull ? classNames?.bullSegment : classNames?.bearSegment,
								isFirstSegment && 'rounded-l-full',
								isLastSegment && 'rounded-r-full',
							)}
							style={
								{
									backgroundColor: allZero
										? 'rgba(255, 255, 255, 0.1)'
										: isBull
											? `rgba(67, 187, 99, ${intensity})` // 綠色
											: `rgba(231, 90, 91, ${intensity})`, // 紅色
								} as CSSProperties
							}
						/>
					);
				})}
			</div>

			{showValues && (
				<div className={cn('flex justify-between w-full', classNames?.valuesWrapper)}>
					<span className={cn('text-xs font-medium text-success', classNames?.bullValue)}>{normalizedBullValue}%</span>
					<span className={cn('text-xs font-medium text-danger', classNames?.bearValue)}>{normalizedBearValue}%</span>
				</div>
			)}
		</div>
	);
};

export { BullBearSlider };
