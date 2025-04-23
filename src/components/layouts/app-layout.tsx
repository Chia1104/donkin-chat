import type { ReactNode, FC, ComponentPropsWithoutRef } from 'react';

import type { Locale } from 'next-intl';
import { ViewTransitions } from 'next-view-transitions';

import { Theme } from '@/enums/theme.enum';
import { noto_sans, AvenirNextLTPro_Regular } from '@/themes/fonts';
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
				className={cn(htmlProps?.className, themeSchema)}
				style={{
					colorScheme: themeSchema,
					...htmlProps?.style,
				}}
			>
				<body
					{...bodyProps}
					className={cn(noto_sans.className, AvenirNextLTPro_Regular.className, bodyProps?.className)}
				>
					{children}
				</body>
			</html>
		</ViewTransitions>
	);
};

export default AppLayout;
