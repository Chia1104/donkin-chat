'use client';

import Error from 'next/error';

import AppLayout from '@/components/layouts/app-layout';
import { Locale } from '@/enums/locale.enum';
import { withError } from '@/hocs/with-error';

const GlobalError = withError(() => {
	return (
		<AppLayout
			locale={Locale.EN_US}
			theme="dark"
			bodyProps={{
				className: 'bg-root min-h-screen text-white',
			}}
		>
			<Error statusCode={500} withDarkMode />
			<style>
				{`.next-error-h1 {
					border-right:1px solid white
				}`}
			</style>
		</AppLayout>
	);
});

export default GlobalError;
