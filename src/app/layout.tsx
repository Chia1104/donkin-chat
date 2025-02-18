import '@solana/wallet-adapter-react-ui/styles.css';

import '@/themes/globals.css';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return <>{children}</>;
};

export default Layout;
