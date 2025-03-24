import type { ResponseData } from '@/types/request';
import { request } from '@/utils/request';

import type { LoginNonceResponse, LoginResponse, LoginRequest } from '../pipes/auth.pipe';
import { loginNonceResponseValidator, loginResponseValidator } from '../pipes/auth.pipe';

export const getLoginNonce = async (address: string) => {
	const response = await request()
		.post('api/v1/login_nonce', {
			json: {
				address,
			},
		})
		.json<ResponseData<LoginNonceResponse>>();

	return loginNonceResponseValidator.parse(response.data);
};

export const login = async (loginRequest: LoginRequest) => {
	const response = await request()
		.post('api/v1/login', {
			json: {
				message: loginRequest.message,
				signature: loginRequest.signature,
			},
		})
		.json<ResponseData<LoginResponse>>();

	return loginResponseValidator.parse(response.data);
};
