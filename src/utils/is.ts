import { z } from 'zod';

export const isNumber = (value: unknown): value is number => {
	return z.number().safeParse(value).success;
};

export const isPositiveNumber = (value: unknown): value is number => {
	return z.number().positive().safeParse(value).success;
};

export const isNegativeNumber = (value: unknown): value is number => {
	return z.number().negative().safeParse(value).success;
};

export const isURL = (value: unknown): value is URL => {
	return z.instanceof(URL).safeParse(value).success;
};

export const isString = (value: unknown): value is string => {
	return z.string().safeParse(value).success;
};

export function isAbortError(error: unknown): error is DOMException {
	return error instanceof DOMException && (error.name === 'AbortError' || error.name === 'TimeoutError');
}
