import { createConfig } from '@privy-io/wagmi';
import { http, cookieStorage, createStorage } from 'wagmi';
import { bsc, mainnet } from 'wagmi/chains';

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
});

declare module 'wagmi' {
	interface Register {
		config: typeof wagmiConfig;
	}
}

export type WagmiConfig = typeof wagmiConfig;
