'use client';

import { memo } from 'react';

const Background = () => {
	return (
		<>
			<div className="from-primary/40 fixed -bottom-40 -right-40 size-[550px] rounded-full bg-linear-to-t blur-3xl cursor-auto select-none z-0"></div>
		</>
	);
};

export default memo(Background);
