import type { CardProps } from '@heroui/card';
import { Card as HCard } from '@heroui/card';

import { cn } from '@/utils/cn';

const Card = (props: CardProps) => (
	<HCard
		aria-label="card"
		{...props}
		className={cn('bg-gradient-to-t from-[#FFFFFF1A] to-[#FFFFFF04] p-4', props.className)}
	/>
);

export default Card;
