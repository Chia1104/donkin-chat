'use client';

import { useEffect } from 'react';

import { ToastProvider } from '@heroui/toast';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

import type { Theme } from '@/enums/theme.enum';
import { useCMD } from '@/hooks/useCMD';
import useDarkMode from '@/hooks/useDarkMode';
import { useGlobalStore } from '@/stores/global/store';
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

const Donkin = () => {
	const toggleDonkin = useGlobalStore(state => state.toggleDonkin);
	const completeDonkin = useGlobalStore(state => state.completeDonkin);
	useCMD(false, {
		cmd: 'i',
		onKeyDown: () => {
			completeDonkin();
			toggleDonkin();
		},
	});
	return null;
};

const AppPlugins = () => {
	return (
		<>
			<Donkin />
			<Wb3StoreConsumer />
			<ToasterPlugin />
			<ToastProvider />
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
		</>
	);
};

export default AppPlugins;
