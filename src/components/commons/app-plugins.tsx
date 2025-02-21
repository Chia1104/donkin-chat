'use client';

import { useEffect } from 'react';

import { ToastProvider } from '@heroui/toast';
import { Toaster } from 'sonner';

import type { Theme } from '@/enums/theme.enum';
import useDarkMode from '@/hooks/useDarkMode';
import { useWeb3Store } from '@/stores/web3/store';

const ToasterPlugin = () => {
	const { theme } = useDarkMode();
	return <Toaster theme={theme as Theme} position="bottom-left" richColors />;
};

const Wb3StoreConsumer = () => {
	useEffect(() => {
		void useWeb3Store.persist.rehydrate();
	}, []);
	return null;
};

const AppPlugins = () => {
	return (
		<>
			<Wb3StoreConsumer />
			<ToasterPlugin />
			<ToastProvider />
		</>
	);
};

export default AppPlugins;
