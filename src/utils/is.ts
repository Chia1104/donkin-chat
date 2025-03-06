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
