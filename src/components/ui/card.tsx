import type { CardProps } from '@heroui/card';
import { Card as HCard } from '@heroui/card';

import { cn } from '@/utils/cn';

const Card = (props: CardProps) => (
	<HCard aria-label="card" {...props} className={cn('shadow-none p-4 bg-content1-300', props.className)} />
);

export default Card;
