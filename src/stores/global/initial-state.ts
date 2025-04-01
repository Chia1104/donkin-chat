import type { DonkinState } from './slices/donkin/initial-state';
import { initialDonkinState } from './slices/donkin/initial-state';
import type { OnboardingState } from './slices/onboarding/initial-state';
import { initialOnboardingState } from './slices/onboarding/initial-state';

export interface GlobalState {
	donkin: DonkinState;
	onboarding: OnboardingState;
}

export const initialGlobalState: GlobalState = {
	donkin: initialDonkinState,
	onboarding: initialOnboardingState,
};
