'use client';

import { Button } from '@heroui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSelector } from './locale-selector';
import { ThemeSelector } from './theme-selector';

interface Props {
	enableTheme?: boolean;
	enableLocale?: boolean;
}

export const Settings = ({ enableTheme = true, enableLocale = true }: Props) => {
	const tLocale = useTranslations('locale');
	const tTheme = useTranslations('theme');

	return (
		<Popover radius="sm">
			<PopoverTrigger>
				<Button isIconOnly variant="bordered" className="border-1" radius="full">
					<SettingsIcon size={16} strokeWidth={1.5} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] px-3 py-4 flex flex-col gap-4">
				{enableLocale && <LocaleSelector label={tLocale('label')} size="sm" labelPlacement="outside" />}
				{enableTheme && <ThemeSelector label={tTheme('label')} size="sm" labelPlacement="outside" />}
			</PopoverContent>
		</Popover>
	);
};
