'use client';

import { HeroUIProvider as _HeroUIProvider } from '@heroui/system';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import type { Locale } from 'next-intl';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { WagmiProvider } from 'wagmi';
import type { State as WagmiSessionState } from 'wagmi';

import { wagmiConfig } from '@/config/wagmi';
import { useRouter } from '@/libs/i18n/routing';
import { getQueryClient } from '@/utils/query-client';

import SolanaWalletProvider from './solana-wallet-provider';

interface Props {
	children?: React.ReactNode;
	messages: AbstractIntlMessages;
	timeZone?: string;
	locale: Locale;
	wagmiSessionState?: WagmiSessionState;
}

const HeroUIProvider = (props: { children: React.ReactNode }) => {
	const router = useRouter();
	const locale = useLocale();
	return (
		<_HeroUIProvider locale={locale} navigate={void router.push} disableRipple>
			{props.children}
		</_HeroUIProvider>
	);
};

const AppProviders = (props: Props) => {
	const queryClient = getQueryClient();
	return (
		<NextIntlClientProvider messages={props.messages} timeZone={props.timeZone} locale={props.locale}>
			<WagmiProvider config={wagmiConfig} initialState={props.wagmiSessionState}>
				<SolanaWalletProvider>
					<QueryClientProvider client={queryClient}>
						<NuqsAdapter>
							<NextThemeProvider forcedTheme="dark" defaultTheme="dark" enableSystem attribute="class">
								<HeroUIProvider>{props.children}</HeroUIProvider>
							</NextThemeProvider>
						</NuqsAdapter>
					</QueryClientProvider>
				</SolanaWalletProvider>
			</WagmiProvider>
		</NextIntlClientProvider>
	);
};

export default AppProviders;
