'use client';

import type { SelectProps } from '@heroui/select';
import { Select, SelectItem } from '@heroui/select';
import { useLocale, useTranslations } from 'next-intl';

import { Locale } from '@/enums/locale.enum';
import { useLocaleRouter, usePathname } from '@/libs/i18n/routing';

export const LocaleSelector = (props: Partial<SelectProps>) => {
	const t = useTranslations('locale');
	const locale = useLocale();
	const router = useLocaleRouter();
	const pathname = usePathname();
	const changeLocale = (locale: Locale) => {
		router.push(pathname, { locale });
		router.refresh();
	};

	return (
		<Select
			classNames={{
				...props.classNames,
				trigger: [
					'border-1 p-2 border-default data-[hover=true]:border-default data-[open=true]:border-default data-[focus=true]:border-default',
					props.classNames?.trigger,
				],
				popoverContent: ['bg-[rgba(28,_38,_51,_1)] shadow-none rounded-sm px-0', props.classNames?.popoverContent],
				listbox: ['px-0', props.classNames?.listbox],
			}}
			variant="bordered"
			aria-label={t('label')}
			{...props}
			selectedKeys={[locale]}
			onSelectionChange={key => changeLocale(key.currentKey as Locale)}
		>
			{Object.values(Locale).map(locale => (
				<SelectItem key={locale}>{t(locale)}</SelectItem>
			))}
		</Select>
	);
};
