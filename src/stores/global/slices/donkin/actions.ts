import type { StateCreator } from 'zustand/vanilla';

import { setNamespace } from '@/stores/utils/storeDebug';

import type { GlobalStore } from '../../store';

const nameSpace = setNamespace('global/donkin');

export interface DonkinAction {
	toggleDonkin: (open?: boolean) => void;
}

export const donkinActions: StateCreator<GlobalStore, [['zustand/devtools', never]], [], DonkinAction> = (
	set,
	get,
) => ({
	toggleDonkin: (open?: boolean) => {
		const current = get().donkin.isOpen;
		set({ donkin: { isOpen: open ?? !current } }, false, nameSpace('toggleDonkin', open ?? !current));
	},
});
