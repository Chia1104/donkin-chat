import React from 'react';
import type { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
	pathProps?: SVGProps<SVGPathElement>;
	rectProps?: SVGProps<SVGRectElement>;
};

export const AscIcon: React.FC<IconSvgProps> = ({ size = 16, width, height, pathProps, rectProps, ...props }) => (
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
			d="M14.388 5.63804L11.25 2.5L8.11189 5.63804C7.85154 5.89838 7.85154 6.32049 8.11189 6.58084C8.37224 6.84118 8.79435 6.84118 9.0547 6.58084L10.5834 5.05215L10.5834 13.7446C10.5834 14.1618 10.8819 14.5001 11.2501 14.5001C11.6183 14.5001 11.9167 14.1618 11.9167 13.7446L11.9167 5.05237L13.4452 6.58084C13.7056 6.84118 14.1277 6.84118 14.388 6.58084C14.6484 6.32049 14.6484 5.89838 14.388 5.63804Z"
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
