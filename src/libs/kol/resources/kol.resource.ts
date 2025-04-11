import { request } from '@/utils/request';

export const getKol = async () => {
	const response = await request().get('/kol');
	return response.json();
};
