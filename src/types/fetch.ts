export const ChatErrorType = {
	InvalidAccessCode: 'InvalidAccessCode', // is in valid password
	UnknownChatFetchError: 'UnknownChatFetchError',

	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	ContentNotFound: 404,
	MethodNotAllowed: 405,
	TooManyRequests: 429,

	InternalServerError: 500,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
} as const;

export type ErrorType = (typeof ChatErrorType)[keyof typeof ChatErrorType];

export interface ErrorResponse {
	body: any;
	errorType: ErrorType;
}
