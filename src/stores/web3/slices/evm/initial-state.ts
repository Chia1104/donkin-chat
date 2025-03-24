import type { WagmiConfig } from '@/config/wagmi';
import { wagmiConfig } from '@/config/wagmi';

export interface Web3EVMState {
	wagmiConfig: WagmiConfig;
}

export const initialWeb3EVMState: Web3EVMState = {
	wagmiConfig,
};
