'use client';

import { useMemo, useRef, useId, useState } from 'react';

import { Tooltip } from '@heroui/tooltip';
import { useIsMounted } from '@heroui/use-is-mounted';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useHover, useInterval } from 'usehooks-ts';

import { DonkinStatus } from '@/enums/donkin.enum';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

import OnboardingTooltip from './onboarding-tooltip';

interface Props {
	current?: DonkinStatus;
	className?: string;
	isActivatable?: boolean;
	opacityOnStatus?: DonkinStatus;
	hiddenOnStatus?: DonkinStatus;
	forceCloseOnOpen?: boolean;
	delay?: number;
	enableEffect?: boolean;
}

const ActiveLogo = (props: Props) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const t = useTranslations('donkin');
	const ref = useRef<HTMLDivElement>(null);
	const isHover = useHover(ref as React.RefObject<HTMLElement>);
	const id = useId();
	const { donkin } = useGlobalStore(state => state.onboarding);
	const onboarding = useGlobalStore(state => state.completeDonkin);
	const [isComponentMounted] = useIsMounted();
	const [debouncedForceOnboarding, setDebouncedForceOnboarding] = useState(false);
	const {
		current = isOpen ? DonkinStatus.Open : DonkinStatus.Close,
		className,
		isActivatable = true,
		opacityOnStatus,
		hiddenOnStatus,
		forceCloseOnOpen = false,
		delay = 0.2,
		enableEffect = false,
	} = props;

	const isActive = useMemo(() => {
		switch (current) {
			case DonkinStatus.Open:
				return isActivatable ? (isHover ? false : true) : true;
			case DonkinStatus.Close:
				return isActivatable ? (isHover ? true : false) : false;
		}
	}, [current, isHover, isActivatable]);

	const content = useMemo(() => {
		if (!isActivatable) return undefined;
		if (!donkin) {
			return <OnboardingTooltip />;
		}
		switch (current) {
			case DonkinStatus.Open:
				return t('action.close');
			case DonkinStatus.Close:
				return t('action.open');
		}
	}, [current, donkin, isActivatable, t]);

	const forceOnboarding = !donkin && isActivatable && isComponentMounted;

	const handleToggle = () => {
		if (isActivatable) {
			if (forceOnboarding) {
				onboarding();
			}
			toggleDonkin();
		}
	};

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

	useInterval(() => {
		setDebouncedForceOnboarding(forceOnboarding);
	}, 500);

	if (hiddenOnStatus === current || (forceCloseOnOpen && isOpen)) return null;

	return (
		<Tooltip
			classNames={{
				content: forceOnboarding && 'bg-transparent p-0 shadow-none border-none',
			}}
			isOpen={debouncedForceOnboarding ? true : undefined}
			content={content}
			showArrow
			isDisabled={!isActivatable}
		>
			<motion.div
				initial={{
					scale: 0,
				}}
				animate={{
					scale: 1,
				}}
				exit={{
					scale: 0,
					opacity: 0,
				}}
				transition={{
					delay,
					ease: 'easeInOut',
					type: 'spring',
					stiffness: 150,
					damping: 15,
				}}
				ref={ref}
				className={cn('relative size-14 transition-opacity duration-300', className, {
					'cursor-pointer': isActivatable,
					'opacity-50 hover:opacity-100': opacityOnStatus === current,
				})}
				onClick={handleToggle}
			>
				<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* 主要圓形 */}
					<circle cx="20" cy="20" r="20" fill="url(#baseGradient)" filter={`url(#${id}-glowEffect)`} />

					{/* 藍色漸變光效 */}
					<circle cx="20" cy="20" r="20" fill={`url(#${id}-blueGradient)`} opacity="0.85" />

					{/* 高光效果 */}
					<circle cx="20" cy="20" r="20" fill={`url(#${id}-highlightGradient)`} opacity="0.7" />

					{/* 水平矩形 - 較短的橫線 */}
					{enableEffect && (
						<motion.rect
							variants={horizontalVariant}
							initial="hidden"
							animate={!isActive ? 'visible' : 'hidden'}
							y="24"
							height="1.5"
							rx="1.5"
							fill={`url(#${id}-lineGradient)`}
						/>
					)}

					{/* 左側豎線 */}
					{enableEffect && (
						<motion.rect
							variants={leftLineVariant}
							initial="hidden"
							animate={isActive ? 'visible' : 'hidden'}
							rx="1.25"
							fill={`url(#${id}-lineGradient)`}
						/>
					)}

					{/* 右側豎線 */}
					{enableEffect && (
						<motion.rect
							variants={rightLineVariant}
							initial="hidden"
							animate={isActive ? 'visible' : 'hidden'}
							rx="1.25"
							fill={`url(#${id}-lineGradient)`}
						/>
					)}

					<defs>
						{/* 底色漸變 */}
						<linearGradient id={`${id}-baseGradient`} x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#09182A" />
							<stop offset="1" stopColor="#0F1319" />
						</linearGradient>

						{/* 藍色放射漸變 */}
						<radialGradient id={`${id}-blueGradient`} cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
							<stop offset="0" stopColor="#35E4FF" />
							<stop offset="1" stopColor="#2474FF" />
						</radialGradient>

						{/* 高光效果 */}
						<radialGradient
							id={`${id}-highlightGradient`}
							cx="0.75"
							cy="0.25"
							r="0.7"
							gradientUnits="objectBoundingBox"
						>
							<stop offset="0.05" stopColor="#47FFF3" stopOpacity="0.7" />
							<stop offset="0.86" stopColor="#FFFFFF" stopOpacity="0" />
						</radialGradient>

						{/* 黑線漸變 */}
						<linearGradient id={`${id}-lineGradient`} x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#151F28" />
							<stop offset="1" stopColor="#362442" />
						</linearGradient>

						{/* 外發光效果 */}
						<filter id={`${id}-glowEffect`} x="-2" y="-1" width="44" height="44" filterUnits="userSpaceOnUse">
							<feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#9DF2FF" floodOpacity="0.25" />
						</filter>
					</defs>
				</svg>
			</motion.div>
		</Tooltip>
	);
};

const FoldLogo = (props: Props) => {
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);
	const isHover = useHover(ref as React.RefObject<HTMLElement>);
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const t = useTranslations('donkin');

	const {
		current = isOpen ? DonkinStatus.Open : DonkinStatus.Close,
		className,
		isActivatable = true,
		opacityOnStatus,
		hiddenOnStatus,
		forceCloseOnOpen = false,
	} = props;

	const handleToggle = () => {
		if (isActivatable) {
			toggleDonkin();
		}
	};

	const content = useMemo(() => {
		if (!isActivatable) return undefined;
		switch (current) {
			case DonkinStatus.Folded:
			case DonkinStatus.Open:
				return t('action.close');
			case DonkinStatus.Close:
				return t('action.open');
		}
	}, [current, isActivatable, t]);

	if (hiddenOnStatus === current || (forceCloseOnOpen && isOpen)) return null;

	return (
		<Tooltip content={content} showArrow isDisabled={!isActivatable}>
			<div
				ref={ref}
				className={cn('relative size-14 transition-opacity duration-300', className, {
					'cursor-pointer': isActivatable,
					'opacity-50 hover:opacity-100': opacityOnStatus === current,
				})}
				onClick={handleToggle}
			>
				<AnimatePresence mode="sync">
					{isHover ? (
						<ActiveLogo
							key="active-logo"
							current={DonkinStatus.Close}
							isActivatable={false}
							className={className}
							delay={0}
						/>
					) : (
						<motion.div
							key="fold-logo"
							initial={{
								scale: 0,
							}}
							animate={{
								scale: 1,
							}}
							exit={{
								scale: 0,
								opacity: 0,
							}}
							transition={{
								ease: 'easeInOut',
								type: 'spring',
								stiffness: 150,
								damping: 15,
							}}
						>
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M7.5307 22.1919C4.6213 19.2825 2.49095 16.3121 1.78049 13.3962C1.08204 10.5295 1.74046 7.65493 4.55818 4.83721C7.37235 2.02304 10.2525 1.40085 13.1293 2.13666C16.0565 2.88539 19.0374 5.05597 21.9482 7.96678C24.859 10.8776 27.0295 13.8584 27.7783 16.7857C28.5141 19.6625 27.8919 22.5426 25.0777 25.3568C22.2662 28.1683 19.3475 28.7852 16.4279 28.0396C13.4601 27.2817 10.4397 25.1009 7.5307 22.1919Z"
									stroke={`url(#${id}-paint0_linear_2321_20381)`}
								/>
								<path
									d="M20.4553 20.9647C17.2253 23.5472 14.1177 25.9605 11.1991 26.9592C9.75469 27.4535 8.39065 27.5879 7.10042 27.2449C5.81328 26.9027 4.54306 26.0703 3.31068 24.5289C0.846196 21.4465 0.549447 18.5402 1.59028 15.7863C2.64955 12.9837 5.11614 10.2839 8.30533 7.73409C11.4945 5.18426 14.6709 3.37228 17.6379 2.95579C20.5534 2.54654 23.3231 3.47562 25.7876 6.55806C27.0397 8.12413 27.6943 9.47479 27.91 10.682C28.1236 11.8774 27.9145 12.9737 27.3616 14.0559C26.8027 15.1499 25.8914 16.2307 24.6992 17.3697C23.5081 18.5076 22.0631 19.6793 20.4553 20.9647Z"
									stroke={`url(#${id}-paint1_linear_2321_20381)`}
								/>
								<path
									d="M18.2407 6.19429C22.1599 7.79422 25.8505 9.37289 28.1247 11.635C29.2476 12.7519 30.0072 14.0201 30.2803 15.5282C30.554 17.04 30.3478 18.8429 29.4502 21.0417C27.6533 25.4434 25.0118 27.5512 21.9326 28.2246C18.8106 28.9074 15.1437 28.1381 11.2828 26.562C7.42193 24.9859 4.26426 22.9694 2.51198 20.2968C0.783689 17.6608 0.371865 14.3067 2.16872 9.90495C3.07615 7.68205 4.06121 6.17548 5.12098 5.19653C6.17055 4.22702 7.31196 3.75739 8.57941 3.63614C9.86164 3.51348 11.2924 3.74578 12.9091 4.21999C14.5253 4.69404 16.2904 5.39818 18.2407 6.19429Z"
									stroke={`url(#${id}-paint2_linear_2321_20381)`}
								/>
								<path
									d="M25.3389 16.5383C25.3389 20.6114 24.678 24.2225 23.0589 26.8005C21.4633 29.3409 18.908 30.9273 14.9586 30.9273C11.012 30.9273 8.55675 29.3441 7.0558 26.8115C5.52827 24.234 4.95996 20.6215 4.95996 16.5383C4.95996 12.4551 5.52827 8.84271 7.0558 6.26521C8.55675 3.73255 11.012 2.14943 14.9586 2.14943C18.908 2.14943 21.4633 3.73576 23.0589 6.27623C24.678 8.85416 25.3389 12.4653 25.3389 16.5383Z"
									stroke={`url(#${id}-paint3_linear_2321_20381)`}
								/>
								<defs>
									<linearGradient
										id={`${id}-paint0_linear_2321_20381`}
										x1="21.2245"
										y1="21.7757"
										x2="4.20462"
										y2="4.48367"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint1_linear_2321_20381`}
										x1="14.9699"
										y1="4.20385"
										x2="12.9695"
										y2="22.4192"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint2_linear_2321_20381`}
										x1="23.7332"
										y1="16.2193"
										x2="31.8877"
										y2="21.9083"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint3_linear_2321_20381`}
										x1="4.65084"
										y1="16.5855"
										x2="26.0298"
										y2="16.5855"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
								</defs>
							</svg>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Tooltip>
	);
};

const ThinkingLogo = (props: Props) => {
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);
	const isHover = useHover(ref as React.RefObject<HTMLElement>);
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const t = useTranslations('donkin');

	const {
		current = isOpen ? DonkinStatus.Open : DonkinStatus.Close,
		className,
		isActivatable = true,
		opacityOnStatus,
		hiddenOnStatus,
		forceCloseOnOpen = false,
	} = props;

	const handleToggle = () => {
		if (isActivatable) {
			toggleDonkin();
		}
	};

	const content = useMemo(() => {
		if (!isActivatable) return undefined;
		switch (current) {
			case DonkinStatus.Folded:
			case DonkinStatus.Open:
				return t('action.close');
			case DonkinStatus.Thinking:
			case DonkinStatus.Close:
				return t('action.open');
		}
	}, [current, isActivatable, t]);

	if (hiddenOnStatus === current || (forceCloseOnOpen && isOpen)) return null;

	return (
		<Tooltip content={content} showArrow isDisabled={!isActivatable}>
			<div
				ref={ref}
				className={cn('relative size-14 transition-opacity duration-300', className, {
					'cursor-pointer': isActivatable,
					'opacity-50 hover:opacity-100': opacityOnStatus === current,
				})}
				onClick={handleToggle}
			>
				<AnimatePresence mode="sync">
					{isHover ? (
						<ActiveLogo
							key="active-logo"
							current={DonkinStatus.Open}
							isActivatable={false}
							className={className}
							delay={0}
						/>
					) : (
						<motion.div
							key="thinking-logo"
							initial={{
								scale: 0,
							}}
							animate={{
								scale: 1,
							}}
							exit={{
								scale: 0,
								opacity: 0,
							}}
							transition={{
								ease: 'easeInOut',
								type: 'spring',
								stiffness: 150,
								damping: 15,
							}}
						>
							<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<motion.path
									d="M7.5307 22.1919C4.6213 19.2825 2.49095 16.3121 1.78049 13.3962C1.08204 10.5295 1.74046 7.65493 4.55818 4.83721C7.37235 2.02304 10.2525 1.40085 13.1293 2.13666C16.0565 2.88539 19.0374 5.05597 21.9482 7.96678C24.859 10.8776 27.0295 13.8584 27.7783 16.7857C28.5141 19.6625 27.8919 22.5426 25.0777 25.3568C22.2662 28.1683 19.3475 28.7852 16.4279 28.0396C13.4601 27.2817 10.4397 25.1009 7.5307 22.1919Z"
									stroke={`url(#${id}-paint0_linear_1947_35728)`}
									strokeWidth={1.2}
									strokeLinecap="round"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{
										pathLength: [0, 1],
										opacity: [0, 1, 1, 0],
									}}
									transition={{
										duration: 1.7,
										ease: 'linear',
										repeat: Infinity,
										repeatType: 'loop',
										times: [0, 0.5, 0.5, 1],
									}}
								/>
								<motion.path
									d="M20.4553 20.9647C17.2253 23.5472 14.1177 25.9605 11.1991 26.9592C9.75469 27.4535 8.39065 27.5879 7.10042 27.2449C5.81328 26.9027 4.54306 26.0703 3.31068 24.5289C0.846196 21.4465 0.549447 18.5402 1.59028 15.7863C2.64955 12.9837 5.11614 10.2839 8.30533 7.73409C11.4945 5.18426 14.6709 3.37228 17.6379 2.95579C20.5534 2.54654 23.3231 3.47562 25.7876 6.55806C27.0397 8.12413 27.6943 9.47479 27.91 10.682C28.1236 11.8774 27.9145 12.9737 27.3616 14.0559C26.8027 15.1499 25.8914 16.2307 24.6992 17.3697C23.5081 18.5076 22.0631 19.6793 20.4553 20.9647Z"
									stroke={`url(#${id}-paint1_linear_1947_35728)`}
									strokeWidth={1.2}
									strokeLinecap="round"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{
										pathLength: [0, 1],
										opacity: [0, 1, 1, 0],
									}}
									transition={{
										duration: 1.7,
										ease: 'linear',
										repeat: Infinity,
										repeatType: 'loop',
										times: [0, 0.5, 0.5, 1],
										delay: 0.5,
									}}
								/>
								<motion.path
									d="M18.2407 6.19429C22.1599 7.79422 25.8505 9.37289 28.1247 11.635C29.2476 12.7519 30.0072 14.0201 30.2803 15.5282C30.554 17.04 30.3478 18.8429 29.4502 21.0417C27.6533 25.4434 25.0118 27.5512 21.9326 28.2246C18.8106 28.9074 15.1437 28.1381 11.2828 26.562C7.42193 24.9859 4.26426 22.9694 2.51198 20.2968C0.783689 17.6608 0.371865 14.3067 2.16872 9.90495C3.07615 7.68205 4.06121 6.17548 5.12098 5.19653C6.17055 4.22702 7.31196 3.75739 8.57941 3.63614C9.86164 3.51348 11.2924 3.74578 12.9091 4.21999C14.5253 4.69404 16.2904 5.39818 18.2407 6.19429Z"
									stroke={`url(#${id}-paint2_linear_1947_35728)`}
									strokeWidth={1.2}
									strokeLinecap="round"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{
										pathLength: [0, 1],
										opacity: [0, 1, 1, 0],
									}}
									transition={{
										duration: 1.7,
										ease: 'linear',
										repeat: Infinity,
										repeatType: 'loop',
										times: [0, 0.5, 0.5, 1],
										delay: 1,
									}}
								/>
								<motion.path
									d="M25.3389 16.5383C25.3389 20.6114 24.678 24.2225 23.0589 26.8005C21.4633 29.3409 18.908 30.9273 14.9586 30.9273C11.012 30.9273 8.55675 29.3441 7.0558 26.8115C5.52827 24.234 4.95996 20.6215 4.95996 16.5383C4.95996 12.4551 5.52827 8.84271 7.0558 6.26521C8.55675 3.73255 11.012 2.14943 14.9586 2.14943C18.908 2.14943 21.4633 3.73576 23.0589 6.27623C24.678 8.85416 25.3389 12.4653 25.3389 16.5383Z"
									stroke={`url(#${id}-paint3_linear_1947_35728)`}
									strokeWidth={1.2}
									strokeLinecap="round"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{
										pathLength: [0, 1],
										opacity: [0, 1, 1, 0],
									}}
									transition={{
										duration: 1.7,
										ease: 'linear',
										repeat: Infinity,
										repeatType: 'loop',
										times: [0, 0.5, 0.5, 1],
										delay: 1.5,
									}}
								/>
								<defs>
									<linearGradient
										id={`${id}-paint0_linear_1947_35728`}
										x1="21.2245"
										y1="21.7757"
										x2="4.20462"
										y2="4.48367"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint1_linear_1947_35728`}
										x1="14.9699"
										y1="4.20385"
										x2="12.9695"
										y2="22.4192"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint2_linear_1947_35728`}
										x1="23.7332"
										y1="16.2193"
										x2="31.8877"
										y2="21.9083"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
									<linearGradient
										id={`${id}-paint3_linear_1947_35728`}
										x1="4.65084"
										y1="16.5855"
										x2="26.0298"
										y2="16.5855"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#35E4FF" stopOpacity="0" />
										<stop offset="1" stopColor="#35E4FF" />
									</linearGradient>
								</defs>
							</svg>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Tooltip>
	);
};

const Logo = (props: Props) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);
	const { current = isOpen ? DonkinStatus.Open : DonkinStatus.Close, ...rest } = props;
	return (
		<AnimatePresence mode="wait">
			{rest.hiddenOnStatus === current ? null : current === DonkinStatus.Thinking ? (
				<ThinkingLogo current={current} {...rest} />
			) : current === DonkinStatus.Folded ? (
				<FoldLogo current={current} {...rest} />
			) : (
				<ActiveLogo current={current} {...rest} />
			)}
		</AnimatePresence>
	);
};

export default Logo;
