'use client';

import { memo } from 'react';

import { Image } from '@heroui/image';
import NextImage from 'next/image';

const Background = () => {
	return (
		<>
			<div className="absolute top-[70px] right-0 z-0 !max-w-[934px] !w-full h-full max-h-[325px] overflow-hidden">
				<Image
					aria-label="Background Vector 1"
					as={NextImage}
					src="/assets/images/bg-vector-1.svg"
					alt="Background Vector 1"
					className="w-full object-cover h-auto"
					fill
					radius="none"
					removeWrapper
					priority
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			</div>
			<div className="absolute top-[70px] z-0 !max-w-[650px] !w-full h-full max-h-[calc(100vh-72px)] overflow-hidden">
				<Image
					aria-label="Background Vector 2"
					as={NextImage}
					src="/assets/images/bg-vector-2.svg"
					alt="Background Vector 2"
					className="w-full object-cover h-auto"
					fill
					radius="none"
					removeWrapper
					priority
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			</div>
			<div className="fixed -bottom-[120px] z-0 !max-w-[800px] right-10 !w-full h-full max-h-[510px] overflow-hidden">
				<Image
					aria-label="Background Vector 3"
					as={NextImage}
					src="/assets/images/bg-vector-3.svg"
					alt="Background Vector 3"
					className="w-full object-cover h-auto"
					fill
					radius="none"
					removeWrapper
					priority
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			</div>
		</>
	);
};

export default memo(Background);
