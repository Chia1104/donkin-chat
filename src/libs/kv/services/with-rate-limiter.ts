import { Ratelimit } from '@upstash/ratelimit';
import type { RatelimitConfig, Duration } from '@upstash/ratelimit';
import { Redis as Upstash } from '@upstash/redis';
import { NextResponse } from 'next/server';

import { errorGenerator } from '@/utils/error';
import { getClientIP } from '@/utils/get-client-ip';

export const presetRateLimiter = ({
	enabled = false,
	bypassError = true,
	onError = (error: Error) => {
		return NextResponse.json(errorGenerator(500, { message: error.message }), {
			status: 500,
		});
	},
	onLimitReached = ({ limit, remaining, reset }) => {
		return NextResponse.json(errorGenerator(429), {
			status: 429,
			headers: {
				'X-RateLimit-Limit': limit.toString(),
				'X-RateLimit-Remaining': remaining.toString(),
				'X-RateLimit-Reset': reset.toString(),
			},
		});
	},
}: {
	enabled?: boolean;
	bypassError?: boolean;
	onError?: (error: Error) => NextResponse;
	onLimitReached?: ({ limit, remaining, reset }: { limit: number; remaining: number; reset: number }) => NextResponse;
}) => ({
	enabled,
	bypassError,
	onError,
	onLimitReached,
});

export const withRateLimiter = <TResponse extends Response, TError extends Error, TRequest extends Request>(
	handler: (req: TRequest, res: TResponse, ip: string) => TResponse | Promise<TResponse> | void | Promise<void>,
	config?: {
		client?: Upstash;
		onLimitReached?: ({
			limit,
			remaining,
			reset,
		}: {
			/**
			 * Maximum number of requests allowed within a window.
			 */
			limit: number;
			/**
			 * How many requests the user has left within the current window.
			 */
			remaining: number;
			/**
			 * Unix timestamp in milliseconds when the limits are reset.
			 */
			reset: number;
		}) => TResponse | Promise<TResponse> | void;
		ratelimit?: Ratelimit | RatelimitConfig;
		onError?: (error: TError) => TResponse | Promise<TResponse> | void;
		tokens?: number;
		window?: Duration;
		prefix?: string;
		timeout?: number;
		analytics?: boolean;
		enabled?: boolean;
		bypassError?: boolean;
	},
) => {
	try {
		return async (req: TRequest, res: TResponse) => {
			const id = getClientIP(req);
			if (!config?.enabled) {
				return handler(req, res, id);
			}
			try {
				const client = config?.client;
				const ratelimit =
					config?.ratelimit instanceof Ratelimit
						? config.ratelimit
						: new Ratelimit(
								config?.ratelimit ?? {
									redis: client ?? Upstash.fromEnv(),
									analytics: config?.analytics ?? true,
									timeout: config?.timeout ?? 1000,
									limiter: Ratelimit.slidingWindow(config?.tokens ?? 10, config?.window ?? '10s'),
									prefix: config?.prefix ?? 'rate-limiter',
								},
							);
				const { success, limit, reset, remaining } = await ratelimit.limit(
					id,
					// @ts-expect-error - are we cool?
					req,
				);
				if (!success) {
					if (config?.onLimitReached) {
						return config?.onLimitReached({
							limit,
							remaining,
							reset,
						});
					}
					return;
				}
				return handler(req, res, id);
			} catch (error) {
				if (config?.bypassError) {
					return handler(req, res, id);
				}
				throw error;
			}
		};
	} catch (error) {
		if (config?.onError) {
			return config?.onError(error as TError);
		}
	}
};
