import React from 'react';
import type { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const DonkinIcon: React.FC<IconSvgProps> = ({ size = 32, width, height, ...props }) => (
	<svg fill="none" height={size || height} viewBox="0 0 32 32" width={size || width} {...props}>
		<g filter="url(#filter0_d_2256_1411)">
			<circle cx="44" cy="43" r="39" fill="url(#paint0_linear_2256_1411)" />
		</g>
		<g opacity="0.85">
			<mask
				id="mask0_2256_1411"
				style={{
					maskType: 'alpha',
				}}
				maskUnits="userSpaceOnUse"
				x="5"
				y="4"
				width="78"
				height="78"
			>
				<circle cx="44" cy="43" r="39" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_2256_1411)">
				<circle cx="44" cy="43" r="39" fill="url(#paint1_radial_2256_1411)" />
				<circle cx="44" cy="43" r="39" fill="url(#paint2_radial_2256_1411)" />
				<circle cx="44" cy="43" r="39" fill="url(#paint3_radial_2256_1411)" />
				<circle cx="44" cy="43" r="39" fill="url(#paint4_radial_2256_1411)" />
				<rect x="36" y="48" width="2" height="10" rx="1" fill="url(#paint5_linear_2256_1411)" />
				<rect x="50" y="48" width="2" height="10" rx="1" fill="url(#paint6_linear_2256_1411)" />
			</g>
		</g>
		<defs>
			<filter
				id="filter0_d_2256_1411"
				x="0"
				y="0"
				width="88"
				height="88"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_2256_1411" />
				<feOffset dy="1" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0.615218 0 0 0 0 0.948569 0 0 0 0 1 0 0 0 0.25 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2256_1411" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2256_1411" result="shape" />
			</filter>
			<linearGradient id="paint0_linear_2256_1411" x1="44" y1="4" x2="44" y2="82" gradientUnits="userSpaceOnUse">
				<stop stopColor="#09182A" />
				<stop offset="1" stopColor="#0F1319" />
			</linearGradient>
			<radialGradient
				id="paint1_radial_2256_1411"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(44 43) rotate(90) scale(39)"
			>
				<stop stopColor="#35E4FF" />
				<stop offset="1" stopColor="#2474FF" />
			</radialGradient>
			<radialGradient
				id="paint2_radial_2256_1411"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(76.5 9.5) rotate(111.682) scale(44.6598)"
			>
				<stop stopColor="white" />
				<stop offset="1" stopColor="white" stopOpacity="0" />
			</radialGradient>
			<radialGradient
				id="paint3_radial_2256_1411"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(27.5 31) rotate(51.0542) scale(46.9308)"
			>
				<stop offset="0.0491908" stopColor="#47FFF3" stopOpacity="0.7" />
				<stop offset="0.859321" stopColor="white" stopOpacity="0" />
			</radialGradient>
			<radialGradient
				id="paint4_radial_2256_1411"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(46 40.5) rotate(142.765) scale(47.101)"
			>
				<stop offset="0.767608" stopColor="white" stopOpacity="0" />
				<stop offset="1" stopColor="white" stopOpacity="0.68" />
			</radialGradient>
			<linearGradient id="paint5_linear_2256_1411" x1="37" y1="48" x2="37" y2="58" gradientUnits="userSpaceOnUse">
				<stop stopColor="#151F28" />
				<stop offset="1" stopColor="#362442" />
			</linearGradient>
			<linearGradient id="paint6_linear_2256_1411" x1="51" y1="48" x2="51" y2="58" gradientUnits="userSpaceOnUse">
				<stop stopColor="#151F28" />
				<stop offset="1" stopColor="#362442" />
			</linearGradient>
		</defs>
	</svg>
);
