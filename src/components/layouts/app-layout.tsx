import type { ReactNode, FC, ComponentPropsWithoutRef } from 'react';

import { ViewTransitions } from 'next-view-transitions';

import { Theme } from '@/enums/theme.enum';
import { cn } from '@/utils/cn';

import Background from '../commons/background';

interface Props {
	children: ReactNode;
	locale?: Locale;
	htmlProps?: ComponentPropsWithoutRef<'html'>;
	bodyProps?: ComponentPropsWithoutRef<'body'>;
	theme?: Theme;
}

const AppLayout: FC<Props> = ({ children, locale, htmlProps, bodyProps, theme }) => {
	const themeSchema = theme ? (theme === Theme.Dark ? Theme.Dark : Theme.Light) : undefined;
	return (
		<ViewTransitions>
			<html
				lang={locale}
				suppressHydrationWarning
				{...htmlProps}
				className={cn(htmlProps?.className, themeSchema)}
				style={{
					colorScheme: themeSchema,
					...htmlProps?.style,
				}}
			>
				<body {...bodyProps}>
					<Background />
					{children}
				</body>
			</html>
		</ViewTransitions>
	);
};

export default AppLayout;
