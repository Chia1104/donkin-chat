import type { ReactNode, FC, ComponentPropsWithoutRef } from 'react';

interface Props {
	children: ReactNode;
	locale?: Locale;
	htmlProps?: ComponentPropsWithoutRef<'html'>;
	bodyProps?: ComponentPropsWithoutRef<'body'>;
}

const AppLayout: FC<Props> = ({ children, locale, htmlProps, bodyProps }) => {
	return (
		<html lang={locale} suppressHydrationWarning {...htmlProps}>
			<body {...bodyProps}>{children}</body>
		</html>
	);
};

export default AppLayout;
