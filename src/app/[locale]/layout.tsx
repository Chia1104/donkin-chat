import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { getMessages, getTimeZone } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { cookieToInitialState } from 'wagmi';

import AppPlugins from '@/components/commons/app-plugins';
import AppLayout from '@/components/layouts/app-layout';
import { wagmiConfig } from '@/config/wagmi';
import AppProviders from '@/contexts/app-providers';
import { routing } from '@/libs/i18n/routing';
import { initDayjs } from '@/utils/dayjs';
import { env } from '@/utils/env';

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
	title: {
		default: `Home | Donkin`,
		template: `%s | Donkin`,
	},
	description: 'This is Donkin',
	creator: 'Donkin',
};

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

const Layout = async ({
	children,
	modal,
	params,
}: {
	children: ReactNode;
	modal: ReactNode;
	params: PageParamsWithLocale;
}) => {
	const locale = (await params).locale;
	if (!routing.locales.includes(locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();
	const timeZone = await getTimeZone();
	initDayjs(locale, timeZone);

	const wagmiSessionState = cookieToInitialState(wagmiConfig, (await headers()).get('cookie'));

	return (
		<AppLayout
			locale={locale}
			bodyProps={{
				className: 'min-h-screen antialiased',
			}}
		>
			<AppProviders messages={messages} timeZone={timeZone} locale={locale} wagmiSessionState={wagmiSessionState}>
				{children}
				{modal}
				<AppPlugins />
			</AppProviders>
		</AppLayout>
	);
};

export default Layout;
