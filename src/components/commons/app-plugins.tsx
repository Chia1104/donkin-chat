'use client';

import { useEffect } from 'react';

import { ToastProvider } from '@heroui/toast';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

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

const AppPlugins = () => {
	return (
		<>
			<Wb3StoreConsumer />
			<ToasterPlugin />
			<ToastProvider
				placement="top-center"
				toastOffset={20}
				toastProps={{
					variant: 'flat',
					classNames: {
						base: 'bg-content1 border-none p-3',
						closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2',
					},
					closeIcon: <X color="rgba(88, 93, 105, 1)" />,
				}}
			/>
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
		</>
	);
};

export default AppPlugins;
