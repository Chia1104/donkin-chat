import { notFound } from 'next/navigation';

import { IS_DEV } from '@/utils/env';

export default function Layout({ children }: { children: React.ReactNode }) {
	if (!IS_DEV) {
		notFound();
	}
	return children;
}
