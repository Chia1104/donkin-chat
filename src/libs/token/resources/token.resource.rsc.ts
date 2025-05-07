import { cache } from 'react';

import 'server-only';

import { getToken as getTokenFromApi, getTokenMetadata as getTokenMetadataFromApi } from './token.resource';

export const getToken = cache(getTokenFromApi);
export const getTokenMetadata = cache(getTokenMetadataFromApi);
