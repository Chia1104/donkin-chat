import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Role } from '@/libs/auth/enums/role.enum';
import { auth } from '@/libs/auth/server';

const Layout = async (props: { children: React.ReactNode }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session && session.user.role === Role.Admin) {
		redirect('/');
	}

	return props.children;
};

export default Layout;
