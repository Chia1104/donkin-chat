'use client';

import type { SelectProps } from '@heroui/select';
import { Select, SelectItem } from '@heroui/select';
import { useTranslations } from 'next-intl';

import { Theme } from '@/enums/theme.enum';
import useDarkMode from '@/hooks/useDarkMode';

export const ThemeSelector = (props: Partial<SelectProps>) => {
	const t = useTranslations('theme');
	const { theme = Theme.System, setTheme } = useDarkMode();

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
			selectedKeys={[theme]}
			onSelectionChange={key => setTheme(key.currentKey as Theme)}
		>
			{Object.values(Theme).map(locale => (
				<SelectItem key={locale}>{t(locale)}</SelectItem>
			))}
		</Select>
	);
};
