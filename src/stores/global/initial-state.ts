import type { DonkinState } from './slices/donkin/initial-state';
import { initialDonkinState } from './slices/donkin/initial-state';

export interface GlobalState {
	donkin: DonkinState;
}

export const initialGlobalState: GlobalState = {
	donkin: initialDonkinState,
};
