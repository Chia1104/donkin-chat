import { z } from 'zod';

export const transactionsBasePipe = z.object({
	token_address: z.string(),
	token_symbol: z.string(),
	token_name: z.string(),
	start_time: z.string(),
	end_time: z.string(),
});

export type TransactionsBase = z.infer<typeof transactionsBasePipe>;

export const transactionPipe = z.object({
	transaction_hash: z.string(),
	timestamp: z.string(),
	// 科學符號
	amount: z.number().transform(val => val.toFixed(20)),
	usd_value: z.number(),
	price_at_time: z.number(),
});

export type Transaction = z.infer<typeof transactionPipe>;

export const transactionsGroupPipe = z.object({
	wallet_address: z.string(),
	transaction_cnt: z.number(),
	total_amount: z.number(),
	total_usd_value: z.number(),
	transactions: z.array(transactionPipe),
});

export type TransactionsGroup = z.infer<typeof transactionsGroupPipe>;

export const transactionsPipe = transactionsBasePipe.extend({
	buy_groups: z.array(transactionsGroupPipe).nullable(),
	sell_groups: z.array(transactionsGroupPipe).nullable(),
});

export type Transactions = z.infer<typeof transactionsPipe>;
