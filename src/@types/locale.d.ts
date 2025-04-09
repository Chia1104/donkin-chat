/* eslint-disable @typescript-eslint/consistent-type-imports */
type Locale = import('next-intl').Locale;

type PropsWithLocale<T = unknown> = T & { locale: Locale };

type PageParamsWithLocale<T = unknown> = Promise<PropsWithLocale<T>>;

type PageSearchParams = import('nuqs/server').SearchParams;

interface PagePropsWithLocale<TParams = unknown, TSearchParams extends PageSearchParams = PageSearchParams> {
	params: PageParamsWithLocale<TParams>;
	searchParams: Promise<TSearchParams>;
	children: React.ReactNode;
}
