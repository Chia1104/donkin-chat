import { z } from 'zod';

export const tokenInfoSchema = z.object({
	token_info: z.string(),
});

export type TokenInfo = z.infer<typeof tokenInfoSchema>;

export const tokenTrendsSchema = z
	.object({
		tweets: z.array(
			z.object({
				id: z.string(),
				username: z.string(),
				is_kol: z.number().or(z.boolean()),
				is_valid_tweet: z.number().or(z.boolean()),
				price_trends: z.enum(['up', 'down', 'none']),
			}),
		),
		price_trends: z.string().nullish(),
		kol_opinions: z.string().nullish(),
		summarize: z.string().nullish(),
	})
	.transform(data => ({
		...data,
		tweets: data.tweets.map(tweet => ({
			...tweet,
			is_kol: tweet.is_kol === 1,
			is_valid_tweet: tweet.is_valid_tweet === 1,
		})),
	}));

export type TokenTrends = z.infer<typeof tokenTrendsSchema>;
