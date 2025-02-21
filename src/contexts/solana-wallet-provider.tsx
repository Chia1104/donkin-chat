'use client';

import React, { useMemo } from 'react';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BitgetWalletAdapter, PhantomWalletAdapter, CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const SolanaWalletProvider = ({ children }: { children: React.ReactNode }) => {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const wallets = useMemo(
		() => [new BitgetWalletAdapter(), new PhantomWalletAdapter(), new CoinbaseWalletAdapter()],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[network],
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default SolanaWalletProvider;
