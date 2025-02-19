import type { Web3ChainState } from './slices/chain/initialState';
import { initialWeb3ChainState } from './slices/chain/initialState';
import type { Web3EVMState } from './slices/evm/initialState';
import { initialWeb3EVMState } from './slices/evm/initialState';

export type Web3StoreState = Web3ChainState & Web3EVMState;

export const initialWeb3StoreState: Web3StoreState = {
	...initialWeb3ChainState,
	...initialWeb3EVMState,
};
