import React from 'react';
import type { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
	pathProps?: SVGProps<SVGPathElement>;
	rectProps?: SVGProps<SVGRectElement>;
};

export const DescIcon: React.FC<IconSvgProps> = ({ size = 16, width, height, pathProps, rectProps, ...props }) => (
	<svg
		width={size || width}
		height={size || height}
		viewBox="0 0 16 17"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.388 11.362L11.25 14.5L8.11189 11.362C7.85154 11.1016 7.85154 10.6795 8.11189 10.4192C8.37224 10.1588 8.79435 10.1588 9.0547 10.4192L10.5834 11.9479L10.5834 3.25544C10.5834 2.83816 10.8819 2.49989 11.2501 2.49989C11.6183 2.49989 11.9167 2.83816 11.9167 3.25544L11.9167 11.9476L13.4452 10.4192C13.7056 10.1588 14.1277 10.1588 14.388 10.4192C14.6484 10.6795 14.6484 11.1016 14.388 11.362Z"
			fill="white"
			fillOpacity="0.65"
			{...pathProps}
		/>
		<rect x="1.75" y="3" width="4.33334" height="4.33328" rx="0.5" stroke="white" strokeOpacity="0.65" {...rectProps} />
		<rect
			x="1.75"
			y="9.66699"
			width="4.33334"
			height="4.33328"
			rx="0.5"
			stroke="white"
			strokeOpacity="0.65"
			{...rectProps}
		/>
	</svg>
);
