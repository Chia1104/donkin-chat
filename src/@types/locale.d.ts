/**
 * @deprecated Use `Locale` from "next-intl"
 * ```ts
 * import type {Locale} from "next-intl";
 * ```
 */
type Locale = (typeof import('@/types/locale').Locale)[keyof typeof import('@/types/locale').Locale];

type PropsWithLocale<T = unknown> = T & { locale?: Locale };

type PageParamsWithLocale<T = unknown> = Promise<T & { locale: Locale }>;

type PageSearchParams = import('nuqs/server').SearchParams;

interface PagePropsWithLocale<TParams = unknown, TSearchParams extends PageSearchParams = PageSearchParams> {
	params: PageParamsWithLocale<TParams>;
	searchParams: Promise<TSearchParams>;
}
