'use client';

import type { GetEnsNameReturnType, GetEnsNameErrorType } from 'viem';
import type { UseAccountReturnType, UseEnsNameReturnType } from 'wagmi';
import { useAccount, useEnsName } from 'wagmi';

interface EnsProfile {
	name: UseEnsNameReturnType<GetEnsNameReturnType>;
}

interface Props {
	pendingFallback?: ((account: UseAccountReturnType) => React.ReactNode) | React.ReactNode;
	errorFallback?: React.ReactNode | ((error: GetEnsNameErrorType) => React.ReactNode);
	children: React.ReactNode | ((ensProfile: EnsProfile, account: UseAccountReturnType) => React.ReactNode);
}

const EnsGuard = (props: Props) => {
	const account = useAccount();
	const ensName = useEnsName({ address: account.address });

	if (ensName.status === 'pending') {
		return typeof props.pendingFallback === 'function' ? props.pendingFallback(account) : props.pendingFallback;
	}

	if (ensName.status === 'error' && ensName.error) {
		return typeof props.errorFallback === 'function' ? props.errorFallback(ensName.error) : props.errorFallback;
	}

	return typeof props.children === 'function' ? props.children({ name: ensName }, account) : props.children;
};

export default EnsGuard;
