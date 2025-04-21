'use client';

import { useEffect } from 'react';

import { ToastProvider } from '@heroui/toast';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

import { useCMD } from '@/hooks/useCMD';
import { useGlobalStore } from '@/stores/global/store';
import { useWeb3Store } from '@/stores/web3/store';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
	ssr: false,
});

const ToasterPlugin = () => {
	return <Toaster theme="dark" position="bottom-left" richColors />;
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
			<ToastProvider placement="top-center" toastOffset={20} />
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
		</>
	);
};

export default AppPlugins;
