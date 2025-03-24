import * as React from 'react';
import type { SVGProps } from 'react';

const WaleIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" {...props}>
		<path
			stroke="#2A68F8"
			strokeMiterlimit="10"
			strokeWidth="0.75"
			d="M13.829 1.023c-.661 0-1.197.571-1.197 1.275 0-.704-.535-1.275-1.196-1.275H10.29v1.585c0 .704.535 1.274 1.196 1.274h.584l-.256 1.702c-.109.718-.69 1.246-1.373 1.246H2.622c-.883 0-1.6.763-1.6 1.704v2.612c0 .941.717 1.704 1.6 1.704h4.732v.198c0 1.064.81 1.927 1.809 1.927V12.85h.696c1.988 0 3.6-1.716 3.6-3.834V3.882h.322c.66 0 1.196-.57 1.196-1.274V1.023h-1.148Z"
		></path>
		<path fill="#2A68F8" d="M6.835 10.29H6.02v.868h.815z"></path>
	</svg>
);

export default WaleIcon;
