import { z } from 'zod';

export const ChainID = {
	ETH: 1,
	BNB: 56,
	SOL: 900,
} as const;

export type ChainID = (typeof ChainID)[keyof typeof ChainID];

export const isChainID = (value: unknown): value is ChainID => {
	return z.nativeEnum(ChainID).safeParse(value).success;
};

export const EVMChainID = {
	ETH: ChainID.ETH,
	BNB: ChainID.BNB,
} as const;

export type EVMChainID = (typeof EVMChainID)[keyof typeof EVMChainID];

export const isEVMChainID = (value: unknown): value is EVMChainID => {
	return z.nativeEnum(EVMChainID).safeParse(value).success;
};

export const ChainSymbol = {
	ETH: 'ETH',
	BNB: 'BNB',
	SOL: 'SOL',
} as const;

export type ChainSymbol = (typeof ChainSymbol)[keyof typeof ChainSymbol];

export const isChainSymbol = (value: unknown): value is ChainSymbol => {
	return z.nativeEnum(ChainSymbol).safeParse(value).success;
};

export const EVMChainSymbol = {
	ETH: ChainSymbol.ETH,
	BNB: ChainSymbol.BNB,
} as const;

export type EVMChainSymbol = (typeof EVMChainSymbol)[keyof typeof EVMChainSymbol];

export const isEVMChainSymbol = (value: unknown): value is EVMChainSymbol => {
	return z.nativeEnum(EVMChainSymbol).safeParse(value).success;
};

export const SVMChainID = {
	SOL: ChainID.SOL,
} as const;

export type SVMChainID = (typeof SVMChainID)[keyof typeof SVMChainID];

export const isSVMChainID = (value: unknown): value is SVMChainID => {
	return z.nativeEnum(SVMChainID).safeParse(value).success;
};

export const SVMChainSymbol = {
	SOL: ChainSymbol.SOL,
} as const;

export type SVMChainSymbol = (typeof SVMChainSymbol)[keyof typeof SVMChainSymbol];

export const isSVMChainSymbol = (value: unknown): value is SVMChainSymbol => {
	return z.nativeEnum(SVMChainSymbol).safeParse(value).success;
};
