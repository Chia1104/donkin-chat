import type { ImageProps } from '@heroui/image';
import { Image } from '@heroui/image';

const Donkin = (props: Partial<ImageProps>) => {
	return <Image src="/assets/images/donkin-title.svg" alt="donkin" removeWrapper width={100} height={36} {...props} />;
};

export default Donkin;
