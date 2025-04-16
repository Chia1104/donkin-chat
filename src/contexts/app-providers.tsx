'use client';

import { HeroUIProvider as _HeroUIProvider } from '@heroui/system';
import { PrivyProvider as _PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useTransitionRouter as useRouter } from 'next-view-transitions';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { WagmiProvider } from 'wagmi';
import type { State as WagmiSessionState } from 'wagmi';

import { wagmiConfig } from '@/config/wagmi';
import { Locale } from '@/enums/locale.enum';
import { env } from '@/utils/env';
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

const PrivyProvider = (props: { children: React.ReactNode }) => {
	const locale = useLocale();

	return (
		<_PrivyProvider
			appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
			clientId={env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
			config={{
				// Customize Privy's appearance in your app
				appearance: {
					theme: '#1C2633',
					accentColor: '#35E4FF',
					logo: 'https://ci1qbccnljacb1o3.public.blob.vercel-storage.com/donkin-ltitle-TXaKRh786HMBAYDPQ3xVEmbjqC8ide.png',
					walletChainType: 'ethereum-and-solana',
				},
				// Create embedded wallets for users who don't have a wallet
				embeddedWallets: {
					ethereum: {
						createOnLogin: 'users-without-wallets',
					},
					solana: {
						createOnLogin: 'users-without-wallets',
					},
				},
				intl: {
					defaultCountry: locale === Locale.EN_US ? 'US' : locale === Locale.ZH_CN ? 'CN' : 'TW',
				},
				loginMethods: ['wallet'],
				externalWallets: { solana: { connectors: toSolanaWalletConnectors() } },
			}}
		>
			{props.children}
		</_PrivyProvider>
	);
};

const AppProviders = (props: Props) => {
	const queryClient = getQueryClient();
	return (
		<NextIntlClientProvider messages={props.messages} timeZone={props.timeZone} locale={props.locale}>
			<WagmiProvider config={wagmiConfig} initialState={props.wagmiSessionState}>
				<SolanaWalletProvider>
					<PrivyProvider>
						<QueryClientProvider client={queryClient}>
							<NuqsAdapter>
								<NextThemeProvider forcedTheme="dark" defaultTheme="dark" enableSystem attribute="class">
									<HeroUIProvider>{props.children}</HeroUIProvider>
								</NextThemeProvider>
							</NuqsAdapter>
						</QueryClientProvider>
					</PrivyProvider>
				</SolanaWalletProvider>
			</WagmiProvider>
		</NextIntlClientProvider>
	);
};

export default AppProviders;
