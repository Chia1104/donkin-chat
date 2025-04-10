'use client';

import type { ComponentPropsWithRef } from 'react';

import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import { useTranslations } from 'next-intl';

import { BullBearSlider } from '@/components/ui/bullbear-slider';
import { cn } from '@/utils/cn';

export interface MarketSentimentProps extends ComponentPropsWithRef<'div'> {
	/**
	 * 看漲情緒值 (0-100)
	 */
	bullValue?: number;
	/**
	 * 看跌情緒值 (0-100)
	 */
	bearValue?: number;
	/**
	 * 區間數量
	 */
	segments?: number;
	/**
	 * 標籤文字
	 */
	label?: string;
	/**
	 * 提示內容
	 */
	tooltip?: string;
	/**
	 * 是否顯示百分比值
	 */
	showValues?: boolean;
	/**
	 * 自訂樣式
	 */
	classNames?: {
		base?: string;
		header?: string;
		label?: string;
		infoIcon?: string;
		bullBearSlider?: {
			base?: string;
			segmentWrapper?: string;
			bullSegment?: string;
			bearSegment?: string;
			valuesWrapper?: string;
			bullValue?: string;
			bearValue?: string;
		};
	};
}

const MarketSentiment = ({
	bullValue = 0,
	bearValue = 0,
	segments = 10,
	label = '',
	tooltip = '',
	showValues = true,
	className,
	classNames,
	ref,
	...props
}: MarketSentimentProps) => {
	const t = useTranslations('token.market-sentiment');
	return (
		<div ref={ref} className={cn('flex flex-1 w-full gap-3', className, classNames?.base)} {...props}>
			<div className="flex flex-1 flex-col gap-3">
				<div className={cn('flex items-center gap-1', classNames?.header)}>
					<span className={cn('text-xs font-normal text-foreground/45', classNames?.label)}>{label}</span>
					<Tooltip content={tooltip} size="sm" placement="top" isDisabled={!tooltip}>
						<span
							className={cn(
								'i-material-symbols-info-outline size-4 text-foreground-500 cursor-help',
								classNames?.infoIcon,
							)}
						/>
					</Tooltip>
				</div>

				<BullBearSlider
					bullValue={bullValue}
					bearValue={bearValue}
					segments={segments}
					classNames={classNames?.bullBearSlider}
				/>
			</div>
			{showValues && (
				<div className="flex flex-col gap-3">
					<Chip
						variant="dot"
						color="success"
						classNames={{
							base: 'border-none h-fit',
							content: 'flex items-center gap-2 text-foreground-500 text-xs',
						}}
					>
						<span>{t('bull')}</span>
						<span>{bullValue} %</span>
					</Chip>
					<Chip
						variant="dot"
						color="danger"
						classNames={{
							base: 'border-none h-fit',
							content: 'flex items-center gap-2 text-foreground-500 text-xs',
						}}
					>
						<span>{t('bear')}</span>
						<span>{bearValue} %</span>
					</Chip>
				</div>
			)}
		</div>
	);
};

export { MarketSentiment };
