'use client';

import { useEffect } from 'react';

import { ToastProvider } from '@heroui/toast';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

import type { Theme } from '@/enums/theme.enum';
import useDarkMode from '@/hooks/useDarkMode';
import { useWeb3Store } from '@/stores/web3/store';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
	ssr: false,
});

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
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
		</>
	);
};

export default AppPlugins;
