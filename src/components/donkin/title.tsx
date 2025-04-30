import type { ImageProps } from '@heroui/image';
import { Image } from '@heroui/image';
import NextImage from 'next/image';

const Donkin = (props: Partial<ImageProps>) => {
	return (
		<Image
			as={NextImage}
			quality={90}
			src="/assets/images/donkin-title.png"
			alt="donkin"
			removeWrapper
			width={100}
			height={36}
			{...props}
		/>
	);
};

export default Donkin;
