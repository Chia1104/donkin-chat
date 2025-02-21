'use client';

import { ScrollShadow } from '@heroui/scroll-shadow';
import { motion } from 'framer-motion';

import Candlestick from '@/components/token/candlestick';
import RankingSection from '@/components/token/ranking-section';

const Detail = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-full h-full flex flex-col"
		>
			<ScrollShadow className="w-full h-[calc(100vh-72px)]">
				<div className="flex flex-col gap-5 w-full">
					<Candlestick />
					<RankingSection />
				</div>
			</ScrollShadow>
		</motion.div>
	);
};

export default Detail;
