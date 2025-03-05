'use client';

import { Button } from '@heroui/button';
import { extendVariants } from '@heroui/react';

export const HeroButton = extendVariants(Button, {
	variants: {
		variant: {
			light: 'data-[hover=true]:bg-default-400',
		},
	},
});
