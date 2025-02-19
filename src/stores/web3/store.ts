import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import type { Web3StoreState } from './initialState';
import { initialWeb3StoreState } from './initialState';
import type { Web3ChainAction } from './slices/chain/actions';
import { web3ChainActions } from './slices/chain/actions';

export type Web3StoreAction = Web3ChainAction;

export type Web3Store = Web3StoreAction & Web3StoreState;

const createStore: StateCreator<Web3Store, [['zustand/devtools', never]]> = (...params) => ({
	...initialWeb3StoreState,

	...web3ChainActions(...params),
});

const devtools = createDevtools('web3');

export const useWeb3Store = createWithEqualityFn<Web3Store>()(subscribeWithSelector(devtools(createStore)), shallow);
