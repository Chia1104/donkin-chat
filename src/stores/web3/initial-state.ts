import type { Web3ChainState } from './slices/chain/initial-state';
import { initialWeb3ChainState } from './slices/chain/initial-state';
import type { Web3EVMState } from './slices/evm/initial-state';
import { initialWeb3EVMState } from './slices/evm/initial-state';

export type Web3StoreState = Web3ChainState & Web3EVMState;

export const initialWeb3StoreState: Web3StoreState = {
	...initialWeb3ChainState,
	...initialWeb3EVMState,
};
