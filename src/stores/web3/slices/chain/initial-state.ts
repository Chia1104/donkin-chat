import {
	ChainID,
	ChainSymbol,
	EVMChainID,
	EVMChainSymbol,
	SVMChainID,
	SVMChainSymbol,
} from '@/libs/web3/enums/chain.enum';
import { SupportedVM } from '@/libs/web3/enums/supportedVM.enum';

export interface Chain {
	chainId: ChainID;
	chainName: string;
	symbol: ChainSymbol;
	vm: SupportedVM;
}

export interface EVMChain {
	chainId: EVMChainID;
	chainName: string;
	symbol: EVMChainSymbol;
	vm: typeof SupportedVM.EVM;
}

export interface SVMChain {
	chainId: SVMChainID;
	chainName: string;
	symbol: SVMChainSymbol;
	vm: typeof SupportedVM.SVM;
}

export interface Web3ChainState extends Chain {
	vm: SupportedVM;
	supportedVM: Chain[];
	supportedEVM: EVMChain[];
	supportedSVM: SVMChain[];
}

export const initialSOLChain: Chain = {
	chainId: ChainID.SOL,
	chainName: ChainSymbol.SOL,
	symbol: ChainSymbol.SOL,
	vm: SupportedVM.SVM,
};

export const initialWeb3ChainState: Web3ChainState = {
	...initialSOLChain,
	supportedEVM: [
		// {
		// 	chainId: EVMChainID.ETH,
		// 	chainName: EVMChainSymbol.ETH,
		// 	symbol: EVMChainSymbol.ETH,
		// 	vm: SupportedVM.EVM,
		// },
		// {
		// 	chainId: EVMChainID.BNB,
		// 	chainName: EVMChainSymbol.BNB,
		// 	symbol: EVMChainSymbol.BNB,
		// 	vm: SupportedVM.EVM,
		// },
	],
	supportedSVM: [
		{
			chainId: SVMChainID.SOL,
			chainName: SVMChainSymbol.SOL,
			symbol: SVMChainSymbol.SOL,
			vm: SupportedVM.SVM,
		},
	],
	supportedVM: [
		{
			chainId: SVMChainID.SOL,
			chainName: SVMChainSymbol.SOL,
			symbol: SVMChainSymbol.SOL,
			vm: SupportedVM.SVM,
		},
		// {
		// 	chainId: EVMChainID.ETH,
		// 	chainName: EVMChainSymbol.ETH,
		// 	symbol: EVMChainSymbol.ETH,
		// 	vm: SupportedVM.EVM,
		// },
		// {
		// 	chainId: EVMChainID.BNB,
		// 	chainName: EVMChainSymbol.BNB,
		// 	symbol: EVMChainSymbol.BNB,
		// 	vm: SupportedVM.EVM,
		// },
	],
};
