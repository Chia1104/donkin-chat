'use client';

import { HeroUIProvider as _HeroUIProvider } from '@heroui/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { useRouter } from '@/i18n/routing';
import defaultTheme from '@/themes/default';
import { createQueryClient } from '@/utils/query-client';

interface Props {
	children?: React.ReactNode;
	messages: AbstractIntlMessages;
	timeZone?: string;
	locale: Locale;
}

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
	if (typeof window === 'undefined') {
		// Server: always make a new query client
		return createQueryClient();
	} else {
		// Browser: use singleton pattern to keep the same query client
		return (clientQueryClientSingleton ??= createQueryClient());
	}
};

const HeroUIProvider = (props: { children: React.ReactNode }) => {
	const router = useRouter();
	return <_HeroUIProvider navigate={void router.push}>{props.children}</_HeroUIProvider>;
};

const AppProviders = (props: Props) => {
	const queryClient = getQueryClient();
	return (
		<NextIntlClientProvider messages={props.messages} timeZone={props.timeZone} locale={props.locale}>
			<QueryClientProvider client={queryClient}>
				<NuqsAdapter>
					<NextThemeProvider defaultTheme="system" enableSystem attribute="class">
						<MuiThemeProvider theme={defaultTheme}>
							<HeroUIProvider>{props.children}</HeroUIProvider>
						</MuiThemeProvider>
					</NextThemeProvider>
				</NuqsAdapter>
			</QueryClientProvider>
		</NextIntlClientProvider>
	);
};

export default AppProviders;
