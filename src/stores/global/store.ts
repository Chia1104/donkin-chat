import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/create-devtools';
import type { GlobalState } from './initial-state';
import { initialGlobalState } from './initial-state';
import type { DonkinAction } from './slices/donkin/actions';
import { donkinActions } from './slices/donkin/actions';
import type { OnboardingAction } from './slices/onboarding/actions';
import { onboardingActions } from './slices/onboarding/actions';

export type GlobalStoreAction = DonkinAction & OnboardingAction;
export type GlobalStore = GlobalState & GlobalStoreAction;

const devtools = createDevtools('donkin-chat.global.store');

const createStore: StateCreator<
	GlobalStore,
	[['zustand/devtools', never]],
	[['zustand/persist', unknown]],
	GlobalStore
> = persist(
	(...params) => ({
		...initialGlobalState,

		...donkinActions(...params),
		...onboardingActions(...params),
	}),
	{
		name: 'donkin-chat.global.store',
		partialize: state => ({
			onboarding: state.onboarding,
		}),
	},
);

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
	subscribeWithSelector(devtools(createStore)),
	shallow,
);
