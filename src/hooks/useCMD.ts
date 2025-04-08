import type { Dispatch, DependencyList } from 'react';
import { useEffect, useState } from 'react';

export const useCMD = (
	defaultOpen = false,
	options?: {
		cmd?: string;
		onKeyDown?: (e: KeyboardEvent) => void;
	},
	deps?: DependencyList,
): [boolean, Dispatch<boolean>] => {
	const cmd = options?.cmd ?? 'k';
	const [open, setOpen] = useState(defaultOpen);
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === cmd && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(open => !open);
				options?.onKeyDown?.(e);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, deps ?? []);
	return [open, setOpen];
};
