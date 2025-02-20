'use client';

import { motion } from 'framer-motion';

const Detail = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-full h-full flex flex-col"
		>
			<h1>Details Page</h1>
		</motion.div>
	);
};

export default Detail;
