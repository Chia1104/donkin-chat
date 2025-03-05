import * as React from 'react';
import type { SVGProps } from 'react';

const CoinIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20" {...props}>
		<path
			fill="#2A68F8"
			d="M8.375 16.417v-1.666h-2.5v-.584h1.667V5.834H5.875v-.583h2.5V3.584h.583v1.667h1.875V3.584h.584v1.667q1.104 0 1.802.698.698.697.698 1.822 0 .689-.271 1.209-.27.52-.688.833.854.23 1.323.886.47.656.469 1.53 0 1.126-.698 1.824t-1.823.698h-.812v1.666h-.584v-1.666H8.958v1.666zm-.25-6.708h3.27q.855 0 1.397-.542.54-.54.541-1.396 0-.854-.541-1.395-.542-.542-1.396-.542H8.125zm0 4.458h4.104q.855 0 1.396-.541.542-.542.542-1.396 0-.855-.542-1.396-.541-.542-1.396-.542H8.125z"
		></path>
	</svg>
);

export default CoinIcon;
