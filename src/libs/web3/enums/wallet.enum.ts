export const ConnectorID = {
	Coinbase: 'coinbaseWalletSDK',
	MetaMask: 'metaMaskSDK',
	Bitget: 'com.bitget.web3',
} as const;

export type ConnectorID = (typeof ConnectorID)[keyof typeof ConnectorID];
