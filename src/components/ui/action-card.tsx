import type { CardProps } from '@heroui/card';
import { CardBody } from '@heroui/card';

import Card from '@/components/ui/card';
import { cn } from '@/utils/cn';

const ActionCard = (props: CardProps) => {
	return (
		<Card
			aria-label="Action Card"
			isPressable
			{...props}
			className={cn('transition duration-300 rounded-sm', 'from-[55%] via-[10%] p-0', props.className)}
		/>
	);
};

const Icon = ({ children }: { children: React.ReactElement }) => {
	return (
		<div
			className={cn(
				'w-6 h-6 border-divider rounded-full gap-4 flex justify-center items-center border-1',
				'bg-gradient-to-b from-black/10 via-black/5 to-white/15 from-[55%] via-[10%]',
			)}
		>
			{children}
		</div>
	);
};

export const ActionBody = ({
	icon,
	label,
	className,
}: {
	icon?: React.ReactElement;
	label: React.ReactNode;
	className?: string;
}) => {
	return (
		<CardBody
			aria-label="Action Body"
			className={cn('flex flex-row items-center justify-between gap-2 text-sm', className)}
		>
			{icon ? <Icon>{icon}</Icon> : null}
			{label}
		</CardBody>
	);
};

export default ActionCard;
