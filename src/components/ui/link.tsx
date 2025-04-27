'use client';

import type { LinkProps } from '@heroui/link';
import { Link as HerouiLink } from '@heroui/link';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { useTranslations } from 'next-intl';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';

import { cn } from '@/utils/cn';

type Props =
	| ({
			href: `/${string}` | `#${string}`;
			withSafeLink: false;
			externalProps?: never;
	  } & Omit<LinkProps, 'href'> &
			Omit<NextLinkProps, 'href'>)
	| ({
			href: string;
			withSafeLink: true;
			externalProps?: Omit<LinkProps, 'href'> & Omit<NextLinkProps, 'href'>;
	  } & Omit<LinkProps, 'href'>)
	| ({
			href: string;
			withSafeLink: false;
			externalProps?: never;
	  } & Omit<LinkProps, 'href'> &
			Omit<NextLinkProps, 'href'>);

export const Link = ({ href, withSafeLink, externalProps, ...props }: Props) => {
	const isInternalLink = href.startsWith('/') || href.startsWith('#');
	const linkProps = isInternalLink ? {} : { target: '_blank', rel: 'noopener noreferrer' };
	const tUtils = useTranslations('utils');
	const tAction = useTranslations('action');

	if (!isInternalLink && withSafeLink) {
		return (
			<Popover
				classNames={{
					base: 'max-w-[200px]',
					content: 'p-3 text-xs text-center gap-1',
				}}
				radius="sm"
			>
				<PopoverTrigger>
					<HerouiLink {...props} underline="always" color="primary" size="sm" className="cursor-pointer">
						{props.children}
					</HerouiLink>
				</PopoverTrigger>
				<PopoverContent>
					<p className="max-w-fit break-all">
						{tUtils('leave-site')}
						<br />
						<b className="text-default-500">{href}</b>
					</p>
					<HerouiLink
						color="primary"
						size="sm"
						{...props}
						href={href}
						as={NextLink}
						{...linkProps}
						{...externalProps}
						className={cn('text-xs', externalProps?.className)}
					>
						{tAction('go-to')}
					</HerouiLink>
				</PopoverContent>
			</Popover>
		);
	}
	return (
		<HerouiLink underline="always" color="primary" size="sm" {...props} as={NextLink} href={href} {...linkProps}>
			{props.children}
		</HerouiLink>
	);
};
