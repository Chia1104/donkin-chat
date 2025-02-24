'use client';

import type { FC, ReactNode } from 'react';

import { Button } from '@heroui/button';
import type { ButtonProps } from '@heroui/button';
import { useFormStatus } from 'react-dom';

interface Props extends Omit<ButtonProps, 'children'> {
	children?: ReactNode | ((isPending: boolean) => ReactNode);
}

const SubmitForm: FC<Props> = ({ children, ...props }) => {
	const { pending } = useFormStatus();

	return (
		<Button aria-label="Submit Form" disabled={pending} isLoading={pending} type="submit" {...props}>
			{typeof children === 'function' ? children(pending) : children}
		</Button>
	);
};

export default SubmitForm;
