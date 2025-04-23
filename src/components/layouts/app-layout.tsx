import type { ReactNode, FC, ComponentPropsWithoutRef } from 'react';

import { ViewTransitions } from 'next-view-transitions';

import { Theme } from '@/enums/theme.enum';
import { noto_sans_tc, noto_sans_sc } from '@/themes/fonts';
import { cn } from '@/utils/cn';

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
				className={cn(htmlProps?.className, themeSchema, noto_sans_tc.variable, noto_sans_sc.variable)}
				style={{
					colorScheme: themeSchema,
					...htmlProps?.style,
				}}
			>
				<body {...bodyProps} className={cn(bodyProps?.className)}>
					{children}
				</body>
			</html>
		</ViewTransitions>
	);
};

export default AppLayout;
