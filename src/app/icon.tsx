import { ImageResponse } from 'next/og';

import { DonkinIcon } from '@/components/icons/donkin-icon';

export const size = {
	width: 32,
	height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
	return new ImageResponse(<DonkinIcon />, {
		...size,
		status: 200,
		debug: true,
	});
}
