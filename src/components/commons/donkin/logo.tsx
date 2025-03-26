'use client';

import { DonkinStatus } from '@/enums/donkin.enum';
import { useGlobalStore } from '@/stores/global/store';
import { cn } from '@/utils/cn';

interface Props {
	current?: DonkinStatus;
	className?: string;
}

const Logo = (props: Props) => {
	const isOpen = useGlobalStore(state => state.donkin.isOpen);

	const { current = isOpen ? DonkinStatus.Open : DonkinStatus.Close, className } = props;

	return (
		<div className={cn('relative size-14', className)}>
			<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* 主要圓形 */}
				<circle cx="20" cy="20" r="20" fill="url(#baseGradient)" filter="url(#glowEffect)" />

				{/* 藍色漸變光效 */}
				<circle cx="20" cy="20" r="20" fill="url(#blueGradient)" opacity="0.85" />

				{/* 高光效果 */}
				<circle cx="20" cy="20" r="20" fill="url(#highlightGradient)" opacity="0.7" />

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

					{/* 外發光效果 */}
					<filter id="glowEffect" x="-2" y="-1" width="44" height="44" filterUnits="userSpaceOnUse">
						<feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#9DF2FF" floodOpacity="0.25" />
					</filter>
				</defs>
			</svg>
		</div>
	);
};

export default Logo;
