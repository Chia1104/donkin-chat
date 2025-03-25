import * as Sentry from '@sentry/nextjs';

export const onRequestError = Sentry.captureRequestError;

export async function register() {
	await import('../sentry.client.config');
}
