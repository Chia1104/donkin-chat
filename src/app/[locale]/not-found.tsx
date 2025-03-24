'use client';

import Error from 'next/error';

const NotFound = () => {
	return (
		<main className="text-white bg-root">
			<Error statusCode={404} withDarkMode />
			<style>
				{`.next-error-h1 {
					border-right:1px solid white
				}`}
			</style>
		</main>
	);
};

export default NotFound;
