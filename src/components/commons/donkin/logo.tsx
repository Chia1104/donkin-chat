'use client';

import { useMemo, useRef } from 'react';

import { Tooltip } from '@heroui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useHover } from 'usehooks-ts';

import { DonkinStatus } from '@/enums/donkin.enum';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

interface Props {
	current?: DonkinStatus;
	className?: string;
	isActivatable?: boolean;
	opacityOnStatus?: DonkinStatus;
	hiddenOnStatus?: DonkinStatus;
}

const ActiveLogo = (props: Props) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const t = useTranslations('donkin');
	const ref = useRef<HTMLDivElement>(null);
	const isHover = useHover(ref as React.RefObject<HTMLElement>);

	const {
		current = isOpen ? DonkinStatus.Open : DonkinStatus.Close,
		className,
		isActivatable = true,
		opacityOnStatus,
		hiddenOnStatus,
	} = props;

	const isActive = useMemo(() => {
		switch (current) {
			case DonkinStatus.Open:
				return isHover ? false : true;
			case DonkinStatus.Close:
				return isHover ? true : false;
		}
	}, [current, isHover]);

	const content = useMemo(() => {
		if (!isActivatable) return undefined;
		switch (current) {
			case DonkinStatus.Open:
				return t('action.close');
			case DonkinStatus.Close:
				return t('action.open');
		}
	}, [current, isActivatable, t]);

	const handleToggle = () => {
		if (isActivatable) {
			toggleDonkin();
		}
	};

	if (hiddenOnStatus === current) return null;

	// 水平線變體
	const horizontalVariant = {
		hidden: { width: 0, x: 20, opacity: 0 },
		visible: { width: 8, x: 16, opacity: 1, transition: { duration: 0.3 } },
	};

	// 垂直線變體
	const leftLineVariant = {
		hidden: { height: 0, y: 23, x: 15, width: 0, opacity: 0 },
		visible: { height: 6, y: 20, x: 15, width: 1.5, opacity: 1, transition: { duration: 0.3 } },
	};

	const rightLineVariant = {
		hidden: { height: 0, y: 23, x: 23.5, width: 0, opacity: 0 },
		visible: { height: 6, y: 20, x: 22.5, width: 1.5, opacity: 1, transition: { duration: 0.3 } },
	};

	return (
		<Tooltip content={content} showArrow>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: opacityOnStatus === current ? (isHover ? 1 : 0.5) : 1 }}
				exit={{ opacity: 0 }}
				ref={ref}
				className={cn('relative size-14 transition-opacity duration-300', className, {
					'cursor-pointer': isActivatable,
				})}
				onClick={handleToggle}
			>
				<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* 主要圓形 */}
					<circle cx="20" cy="20" r="20" fill="url(#baseGradient)" filter="url(#glowEffect)" />

					{/* 藍色漸變光效 */}
					<circle cx="20" cy="20" r="20" fill="url(#blueGradient)" opacity="0.85" />

					{/* 高光效果 */}
					<circle cx="20" cy="20" r="20" fill="url(#highlightGradient)" opacity="0.7" />

					{/* 水平矩形 - 較短的橫線 */}
					<motion.rect
						variants={horizontalVariant}
						initial="hidden"
						animate={!isActive ? 'visible' : 'hidden'}
						y="24"
						height="1.5"
						rx="1.5"
						fill="url(#lineGradient)"
					/>

					{/* 左側豎線 */}
					<motion.rect
						variants={leftLineVariant}
						initial="hidden"
						animate={isActive ? 'visible' : 'hidden'}
						rx="1.25"
						fill="url(#lineGradient)"
					/>

					{/* 右側豎線 */}
					<motion.rect
						variants={rightLineVariant}
						initial="hidden"
						animate={isActive ? 'visible' : 'hidden'}
						rx="1.25"
						fill="url(#lineGradient)"
					/>

					<defs>
						{/* 底色漸變 */}
						<linearGradient id="baseGradient" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#09182A" />
							<stop offset="1" stopColor="#0F1319" />
						</linearGradient>

						{/* 藍色放射漸變 */}
						<radialGradient id="blueGradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
							<stop offset="0" stopColor="#35E4FF" />
							<stop offset="1" stopColor="#2474FF" />
						</radialGradient>

						{/* 高光效果 */}
						<radialGradient id="highlightGradient" cx="0.75" cy="0.25" r="0.7" gradientUnits="objectBoundingBox">
							<stop offset="0.05" stopColor="#47FFF3" stopOpacity="0.7" />
							<stop offset="0.86" stopColor="#FFFFFF" stopOpacity="0" />
						</radialGradient>

						{/* 黑線漸變 */}
						<linearGradient id="lineGradient" x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#151F28" />
							<stop offset="1" stopColor="#362442" />
						</linearGradient>

						{/* 外發光效果 */}
						<filter id="glowEffect" x="-2" y="-1" width="44" height="44" filterUnits="userSpaceOnUse">
							<feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#9DF2FF" floodOpacity="0.25" />
						</filter>
					</defs>
				</svg>
			</motion.div>
		</Tooltip>
	);
};

const Logo = (props: Props) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const { current = isOpen ? DonkinStatus.Open : DonkinStatus.Close, ...rest } = props;
	return (
		<AnimatePresence mode="wait">
			{rest.hiddenOnStatus === current ? null : <ActiveLogo current={current} {...rest} />}
		</AnimatePresence>
	);
};

export default Logo;
