export const SolanaNetworks = {
	mainnet: 'mainnet-beta',
	devnet: 'devnet',
	testnet: 'testnet',
} as const;

export type SolanaNetworks = (typeof SolanaNetworks)[keyof typeof SolanaNetworks];
