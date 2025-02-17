import type { CardProps } from '@heroui/card';
import { Card, CardBody } from '@heroui/card';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { cn } from '@/utils/cn';

const ActionCard = (props: CardProps) => {
	return (
		<Card
			isPressable
			{...props}
			className={cn(
				'transition duration-300 border-1 border-divider',
				'bg-gradient-to-b from-black/10 via-black/5 to-white/15 from-[55%] via-[10%]',
				props.className,
			)}
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

export const ActionBody = ({ icon, label }: { icon: React.ReactElement; label: React.ReactNode }) => {
	return (
		<CardBody className="flex flex-row items-center justify-between">
			<span className="flex gap-2 items-center text-sm">
				<Icon>{icon}</Icon>
				{label}
			</span>
			<ChevronRightIcon />
		</CardBody>
	);
};

export default ActionCard;
