import '@solana/wallet-adapter-react-ui/styles.css';
import 'katex/dist/katex.min.css';
import type { Viewport } from 'next';

import '@/themes/globals.css';

interface Props {
	children: React.ReactNode;
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#030514' },
		{ media: '(prefers-color-scheme: dark)', color: '#030514' },
	],
	colorScheme: 'dark',
	width: 'device-width',
};

const Layout = ({ children }: Props) => {
	return children;
};

export default Layout;
