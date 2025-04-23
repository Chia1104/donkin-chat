export const getClientIP = (request: Request, fallback = 'anonymous'): string => {
	return (
		request.headers.get('CF-Connecting-IP') ??
		request.headers.get('X-Forwarded-For')?.split(',')[0] ??
		request.headers.get('X-Real-IP') ??
		fallback
	);
};
