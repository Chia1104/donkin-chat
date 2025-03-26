import { subscribeWithSelector } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/create-devtools';
import type { GlobalState } from './initial-state';
import { initialGlobalState } from './initial-state';
import type { DonkinAction } from './slices/donkin/actions';
import { donkinActions } from './slices/donkin/actions';

export type GlobalStoreAction = DonkinAction;
export type GlobalStore = GlobalState & GlobalStoreAction;

const devtools = createDevtools('donkin-chat.global.store');

const createStore: StateCreator<GlobalStore, [['zustand/devtools', never]], [], GlobalStore> = (...params) => ({
	...initialGlobalState,

	...donkinActions(...params),
});

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(subscribeWithSelector(devtools(createStore)));
