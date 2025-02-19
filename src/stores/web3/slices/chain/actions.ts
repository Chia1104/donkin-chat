import { switchChain, getChainId } from '@wagmi/core';
import type { StateCreator } from 'zustand/vanilla';

import { ChainID } from '@/enums/web3/chain.enum';
import { isEVMChainID, isSVMChainID } from '@/enums/web3/chain.enum';
import { setNamespace } from '@/utils/storeDebug';

import type { Web3Store } from '../../store';
import type { Chain } from './initialState';
import { initialSOLChain } from './initialState';

const nameSpace = setNamespace('web3/chain');

export interface Web3ChainAction {
	switchChain: (chainId: ChainID) => void;
	getCurrentChain: () => Chain;
}

export const web3ChainActions: StateCreator<Web3Store, [['zustand/devtools', never]], [], Web3ChainAction> = (
	set,
	get,
) => ({
	switchChain: (chainId: ChainID) => {
		const { wagmiConfig, supportedEVM } = get();

		if (isEVMChainID(chainId)) {
			const evm = supportedEVM.find(evm => evm.chainId === chainId);
			if (!evm) return;
			void switchChain(wagmiConfig, { chainId: chainId });
			set({ ...evm, vm: 'EVM' }, false, nameSpace('switchChain', evm));
			return;
		} else if (isSVMChainID(chainId)) {
			const svm = get().supportedSVM.find(svm => svm.chainId === chainId);
			if (!svm) return;
			set({ ...svm, vm: 'SVM' }, false, nameSpace('switchChain', svm));
			return;
		}
	},
	getCurrentChain: () => {
		const { chainId, supportedSVM, supportedEVM } = get();
		const currentEVMChainID = getChainId(get().wagmiConfig);
		if (chainId !== currentEVMChainID) {
			return supportedSVM.find(svm => svm.chainId === ChainID.SOL) ?? initialSOLChain;
		}
		return supportedEVM.find(evm => evm.chainId === currentEVMChainID) ?? initialSOLChain;
	},
});
