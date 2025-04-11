import { z } from 'zod';

export const kolAlertPipe = z.object({
	token_address: z.string(),
	time_unit: z.string(),
	day: z.string(),
	day_unix_time: z.number(),
	kol_alerts: z.number(),
	kol_alert_usernames: z.array(z.string()),
});

export type KolAlert = z.infer<typeof kolAlertPipe>;
