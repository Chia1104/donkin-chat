import { PrivyClient } from '@privy-io/server-auth';
import 'server-only';

import { env } from '@/utils/env';

export const privy = new PrivyClient(env.NEXT_PUBLIC_PRIVY_APP_ID, env.PRIVY_SECRET);
