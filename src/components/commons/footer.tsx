import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18n/routing';

const Footer = () => {
	const t = useTranslations('footer');
	return (
		<footer className="p-5 w-full flex flex-col md:flex-row md:items-center md:h-[40px] h-[200px] text-foreground-500 justify-between">
			<section className="flex flex-col md:flex-row md:gap-[50px] gap-5 md:items-center">
				<Link className="text-[10px] leading-[12px] w-fit" href="#">
					{t('about')}
				</Link>
				<Link className="text-[10px] leading-[12px] w-fit" href="#">
					{t('privacy')}
				</Link>
				<Link className="text-[10px] leading-[12px] w-fit" href="#">
					{t('contact')}
				</Link>
			</section>
			<section className="justify-self-end">
				<span className="text-[10px] leading-[12px]">
					{t('copyright', { year: new Date().getFullYear().toString() })}
				</span>
			</section>
		</footer>
	);
};

export default Footer;
