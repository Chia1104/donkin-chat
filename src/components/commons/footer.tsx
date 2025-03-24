import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

const Footer = () => {
	const t = useTranslations('footer');
	return (
		<footer className="px-5 w-full flex justify-between items-center h-[70px] text-foreground-500">
			<section className="flex gap-[50px] items-center">
				<Link className="text-[10px] leading-[12px]" href="#">
					{t('about')}
				</Link>
				<Link className="text-[10px] leading-[12px]" href="#">
					{t('privacy')}
				</Link>
				<Link className="text-[10px] leading-[12px]" href="#">
					{t('contact')}
				</Link>
			</section>
			<section>
				<span className="text-[10px] leading-[12px]">
					{t('copyright', { year: new Date().getFullYear().toString() })}
				</span>
			</section>
		</footer>
	);
};

export default Footer;
