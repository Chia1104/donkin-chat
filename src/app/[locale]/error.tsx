'use client';

import NextError from 'next/error';

import { withError } from '@/hocs/with-error';

const Error = withError(() => {
	return <NextError statusCode={500} withDarkMode />;
});

export default Error;
