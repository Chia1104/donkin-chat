import { useTranslations } from 'next-intl';

import { michroma } from '@/themes/fonts';
import { cn } from '@/utils/cn';

const Donkin = () => {
	const t = useTranslations('meta');
	return (
		<span className={cn('uppercase font-normal text-base leading-[22.75px]', michroma.className)}>{t('title')}</span>
	);
};

export default Donkin;
