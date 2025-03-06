import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import { getMessages, getTimeZone } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { cookieToInitialState } from 'wagmi';

import AppPlugins from '@/components/commons/app-plugins';
import AppLayout from '@/components/layouts/app-layout';
import { wagmiConfig } from '@/config/wagmi';
import AppProviders from '@/contexts/app-providers';
import { routing } from '@/i18n/routing';
import { initDayjs } from '@/utils/dayjs';
import { env } from '@/utils/env';

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#030514' },
		{ media: '(prefers-color-scheme: dark)', color: '#030514' },
	],
	colorScheme: 'dark',
	width: 'device-width',
};

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
				className: 'bg-root min-h-screen',
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
