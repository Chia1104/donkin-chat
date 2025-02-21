import { coreMessageSchema } from 'ai';
import { z } from 'zod';

export const ChatDTOSchema = z.object({
	id: z.string(),
	messages: z.array(coreMessageSchema),
});
