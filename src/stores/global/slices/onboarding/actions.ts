import type { StateCreator } from 'zustand/vanilla';

import { setNamespace } from '@/stores/utils/storeDebug';

import type { GlobalStore } from '../../store';

const nameSpace = setNamespace('global/onboarding');

export interface OnboardingAction {
	completeDonkin: () => void;
}

export const onboardingActions: StateCreator<
	GlobalStore,
	[['zustand/devtools', never]],
	[],
	OnboardingAction
> = set => ({
	completeDonkin: () => {
		set({ onboarding: { donkin: true } }, false, nameSpace('completeDonkin'));
	},
});
