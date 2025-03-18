import { z } from 'zod';

export const numericString = z.string().pipe(z.coerce.number());
