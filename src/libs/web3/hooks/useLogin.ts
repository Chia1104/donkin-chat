import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { LoginResponse, LoginRequest } from '../pipes/auth.pipe';
import { login } from '../resources/auth.resource';

export const useLoginMutation = <TContext = unknown>(
	options?: UseMutationOptions<LoginResponse, Error, LoginRequest, TContext>,
) => {
	return useMutation<LoginResponse, Error, LoginRequest, TContext>({
		mutationFn: login,
		...options,
	});
};
