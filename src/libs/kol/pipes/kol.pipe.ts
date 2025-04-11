import { z } from 'zod';

export const kolPipe = z.object({
	address: z.string(),
	symbol: z.string(),
});
