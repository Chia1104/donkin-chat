import { z } from 'zod';

export const numericString = z.string().transform(val => Number(val));

export const paginationSchema = z.object({
	total: z.number(),
	page: z.number(),
	page_size: z.number(),
});
