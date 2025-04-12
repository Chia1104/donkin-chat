import { cache } from 'react';

import 'server-only';

import { getAddress as getAddressFromApi } from './address.resource';

export const getAddress = cache(getAddressFromApi);
