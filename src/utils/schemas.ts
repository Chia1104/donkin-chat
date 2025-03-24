import { z } from 'zod';

export const numericString = z.string().pipe(z.coerce.number());

export const paginationSchema = z.object({
	total: z.number(),
	page: z.number(),
	page_size: z.number(),
});
