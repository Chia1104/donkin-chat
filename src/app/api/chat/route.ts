import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ChatDTOSchema } from '@/libs/ai/validators/chat';
import { ParseJSONError } from '@/utils/error';
import { aiChatFlag } from '@/utils/flags';

export const maxDuration = 60;

export async function POST(req: Request) {
	try {
		const enabled = await aiChatFlag();
		if (!enabled) {
			return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
		}

		let dto: unknown;

		await req
			.json()
			.then(data => {
				dto = data;
			})
			.catch((error: Error) => {
				throw new ParseJSONError(error);
			});

		const parsed = ChatDTOSchema.parse(dto);

		const result = streamText({
			model: openai('gpt-4o-mini'),
			messages: parsed.messages,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		if (error instanceof ParseJSONError) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
