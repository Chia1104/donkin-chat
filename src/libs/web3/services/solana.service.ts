import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { env, IS_DEV } from '@/utils/env';

import type { SolanaNetworks } from '../enums/solana.enum';

export const getSolBalance = async (address: string, network: SolanaNetworks = IS_DEV ? 'devnet' : 'mainnet-beta') => {
	const connection = new Connection(network === 'mainnet-beta' ? env.NEXT_PUBLIC_SOLANA_RPC : clusterApiUrl(network));
	const publicKey = new PublicKey(address);
	const balance = await connection.getBalance(publicKey);
	return balance / LAMPORTS_PER_SOL;
};
