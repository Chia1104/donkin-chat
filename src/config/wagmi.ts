import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { bsc, mainnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	chains: [mainnet, bsc],
	transports: {
		[mainnet.id]: http(),
		[bsc.id]: http(),
	},
	connectors: [coinbaseWallet(), metaMask()],
});

declare module 'wagmi' {
	interface Register {
		config: typeof wagmiConfig;
	}
}

export type WagmiConfig = typeof wagmiConfig;
