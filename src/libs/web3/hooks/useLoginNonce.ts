import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { LoginNonceResponse } from '../pipes/auth.pipe';
import { getLoginNonce } from '../resources/auth.resource';

export const useLoginNonceMutation = <TContext = unknown>(
	options?: UseMutationOptions<LoginNonceResponse, Error, string, TContext>,
) => {
	return useMutation<LoginNonceResponse, Error, string, TContext>({
		mutationFn: getLoginNonce,
		...options,
	});
};
