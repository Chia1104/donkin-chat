import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/create-devtools';
import type { Web3StoreState } from './initial-state';
import { initialWeb3StoreState } from './initial-state';
import type { Web3ChainAction } from './slices/chain/actions';
import { web3ChainActions } from './slices/chain/actions';

export type Web3StoreAction = Web3ChainAction;

export type Web3Store = Web3StoreAction & Web3StoreState;

const createStore: StateCreator<Web3Store, [['zustand/devtools', never]], [['zustand/persist', unknown]]> = persist(
	(...params) => ({
		...initialWeb3StoreState,

		...web3ChainActions(...params),
	}),
	{
		name: 'donkin-chat.web3.store',
		partialize: state => ({ chainId: state.chainId, chainName: state.chainName, symbol: state.symbol, vm: state.vm }),
		skipHydration: true,
	},
);

const devtools = createDevtools('donkin-chat.web3.store');

export const useWeb3Store = createWithEqualityFn<Web3Store>()(subscribeWithSelector(devtools(createStore)), shallow);
