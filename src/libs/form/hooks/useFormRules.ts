import { useMemo } from 'react';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const useFormRules = () => {
	const intl = useTranslations('validation');
	const messages = useMemo(
		() => ({
			primitive: {
				required_error: intl('required'),
				invalid_type_error: intl('invalid-type'),
			},
		}),
		[intl],
	);

	const patterns = useMemo(
		() => ({
			/**
			 * 電子郵件
			 */
			email: z
				.string({
					required_error: messages.primitive.required_error,
					invalid_type_error: messages.primitive.invalid_type_error,
				})
				.email({
					message: intl('pattern.email'),
				}),
			/**
			 * 必填字串
			 */
			required: z
				.string({
					required_error: messages.primitive.required_error,
					invalid_type_error: messages.primitive.invalid_type_error,
				})
				.min(1, {
					message: messages.primitive.required_error,
				}),
			/**
			 * URL 格式
			 */
			url: z.union([
				z
					.string({
						required_error: messages.primitive.required_error,
						invalid_type_error: messages.primitive.invalid_type_error,
					})
					.url({
						message: intl('pattern.url'),
					})
					.startsWith('http://', {
						message: intl('pattern.url'),
					}),
				z
					.string({
						required_error: messages.primitive.required_error,
						invalid_type_error: messages.primitive.invalid_type_error,
					})
					.url({
						message: intl('pattern.url'),
					})
					.startsWith('https://', {
						message: intl('pattern.url'),
					}),
			]),
			/**
			 * dayjs 實例
			 */
			dayjs: z.instanceof(dayjs as unknown as typeof dayjs.Dayjs, {
				message: messages.primitive.invalid_type_error,
			}),
			/**
			 * 時間戳
			 */
			timeStamps: z.number({
				required_error: messages.primitive.required_error,
				invalid_type_error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 數字字串
			 */
			numericString: z
				.string({
					required_error: messages.primitive.required_error,
					invalid_type_error: messages.primitive.invalid_type_error,
				})
				.pipe(
					z.coerce.number({
						required_error: messages.primitive.required_error,
						invalid_type_error: messages.primitive.invalid_type_error,
					}),
				),
			/**
			 * 大於 0 的整數
			 */
			moreThenZeroNumber: z
				.number({
					message: intl('pattern.more-than-0'),
				})
				.int({
					message: intl('pattern.more-than-0'),
				})
				.positive({
					message: intl('pattern.more-than-0'),
				}),
			/**
			 * 整數
			 */
			intNumber: z
				.number({
					message: intl('pattern.number'),
				})
				.int({
					message: intl('pattern.number'),
				}),
			number: z.number({
				message: intl('pattern.number'),
			}),
			/**
			 * 大於等於 0 的整數
			 */
			greaterThanOrEqualToZeroNumber: z
				.number({
					message: intl('pattern.number'),
				})
				.int({
					message: intl('pattern.number'),
				})
				.min(0, {
					message: intl('pattern.number'),
				}),
			/**
			 * 字串 允許空字串
			 */
			text: z.string({
				required_error: messages.primitive.required_error,
				invalid_type_error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 布林值
			 */
			boolean: z.boolean({
				required_error: messages.primitive.required_error,
				invalid_type_error: messages.primitive.invalid_type_error,
			}),
		}),
		[intl, messages.primitive],
	);

	return {
		messages,
		patterns,
	};
};
