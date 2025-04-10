'use client';

import Error from 'next/error';

import AppLayout from '@/components/layouts/app-layout';
import { Locale } from '@/enums/locale.enum';

const Forbidden = () => {
	return (
		<AppLayout
			locale={Locale.EN_US}
			theme="dark"
			bodyProps={{
				className: 'bg-root min-h-screen text-white',
			}}
		>
			<Error statusCode={403} withDarkMode title="Sorry, you are not allowed to access this page" />
			<style>
				{`.next-error-h1 {
					border-right:1px solid white
				}`}
			</style>
		</AppLayout>
	);
};

export default Forbidden;
