import { cache } from 'react';

import 'server-only';

import { getToken as getTokenFromApi } from './token.resource';

export const getToken = cache(getTokenFromApi);
