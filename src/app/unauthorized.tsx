import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/routing';

const Unauthorized = async () => {
	const locale = await getLocale();
	redirect({
		href: '/sign-in',
		locale,
	});
};

export default Unauthorized;
