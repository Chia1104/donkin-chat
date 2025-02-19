import { ChainID, ChainSymbol, EVMChainID, EVMChainSymbol, SVMChainID, SVMChainSymbol } from '@/enums/web3/chain.enum';
import { SupportedVM } from '@/enums/web3/supportedVM.enum';

export interface Chain {
	chainId: ChainID;
	chainName: string;
	symbol: ChainSymbol;
}

export interface EVMChain {
	chainId: EVMChainID;
	chainName: string;
	symbol: EVMChainSymbol;
}

export interface SVMChain {
	chainId: SVMChainID;
	chainName: string;
	symbol: SVMChainSymbol;
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
};

export const initialWeb3ChainState: Web3ChainState = {
	...initialSOLChain,
	vm: SupportedVM.SVM,
	supportedEVM: [
		{
			chainId: EVMChainID.ETH,
			chainName: EVMChainSymbol.ETH,
			symbol: EVMChainSymbol.ETH,
		},
		{
			chainId: EVMChainID.BNB,
			chainName: EVMChainSymbol.BNB,
			symbol: EVMChainSymbol.BNB,
		},
	],
	supportedSVM: [
		{
			chainId: SVMChainID.SOL,
			chainName: SVMChainSymbol.SOL,
			symbol: SVMChainSymbol.SOL,
		},
	],
	supportedVM: [
		{
			chainId: EVMChainID.ETH,
			chainName: EVMChainSymbol.ETH,
			symbol: EVMChainSymbol.ETH,
		},
		{
			chainId: EVMChainID.BNB,
			chainName: EVMChainSymbol.BNB,
			symbol: EVMChainSymbol.BNB,
		},
		{
			chainId: SVMChainID.SOL,
			chainName: SVMChainSymbol.SOL,
			symbol: SVMChainSymbol.SOL,
		},
	],
};
