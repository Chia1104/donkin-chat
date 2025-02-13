import { CircularProgress } from '@heroui/progress';
import { useTranslations } from 'next-intl';

import { TextPath } from '@/components/ui/text-path';
import { cn } from '@/utils/cn';

interface Props {
	className?: string;
	title?: string;
}

const AppLoading = (props: Props) => {
	const t = useTranslations('meta');
	return (
		<div className={cn('flex flex-col justify-center items-center h-full w-full gap-3', props.className)}>
			<span className="w-full max-w-[300px]">
				<TextPath
					text={props.title || t('title')}
					svgProps={{
						viewBox: '0 0 320 100',
					}}
				/>
			</span>
			<CircularProgress aria-label="Loading..." />
		</div>
	);
};

export default AppLoading;
