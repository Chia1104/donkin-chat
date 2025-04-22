'use client';

import { use, useTransition, createContext, useState, useRef } from 'react';

import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { InputOtp } from '@heroui/input-otp';
import { Link } from '@heroui/link';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from '@heroui/modal';
import { addToast } from '@heroui/toast';
import { getAccessToken as _getAccessToken } from '@privy-io/react-auth';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useTransitionRouter } from 'next-view-transitions';

import { useLoginWithInvitationsCode } from '@/libs/auth/hooks/useLoginWithInvitationsCode';
import { truncateMiddle } from '@/utils/format';
import { tryCatch } from '@/utils/try-catch';

import Donkin from '../donkin/title';

const getAccessToken = tryCatch(_getAccessToken());

interface Props {
	isRegistered: boolean;
	isWalletConnected: boolean;
	children: React.ReactNode;
	enabled?: boolean;
}

interface AuthGuardContext {
	isAuthenticated: boolean;
	enabled: boolean;
	canActivate: boolean;
}

const AuthGuardContext = createContext<AuthGuardContext | null>(null);

export const useAuthGuard = (name = 'useAuthGuard') => {
	const context = use(AuthGuardContext);
	if (!context) {
		throw new Error(`${name} must be used within a AuthGuard`);
	}
	return context;
};

const Welcome = () => {
	const t = useTranslations('meta');
	const tAction = useTranslations('action');
	const router = useTransitionRouter();
	const { login: privyLogin } = useLogin({
		onComplete: () => {
			router.refresh();
		},
	});

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
			<ModalBody className="flex flex-col items-center justify-center text-center mb-3 sm:mb-5 px-3 sm:px-0">
				<Donkin width={167} height={60} className="mb-3 sm:mb-8" />
				<h2 className="text-xl sm:text-4xl font-medium mb-1 sm:mb-3">{t('description1')}</h2>
				<p className="font-light text-base sm:text-xl mb-3 sm:mb-8 text-default-500">{t('description2')}</p>
				<Button
					onPress={() =>
						privyLogin({
							loginMethods: ['wallet'],
							disableSignup: false,
						})
					}
					color="primary"
				>
					{tAction('experience')}
				</Button>
			</ModalBody>
		</motion.div>
	);
};

const CodeRegister = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const t = useTranslations('auth.guard.code-register');
	const [isLoading, startTransition] = useTransition();
	const { user, logout } = usePrivy();
	const router = useTransitionRouter();
	const [value, setValue] = useState('');
	const [callbackError, setCallbackError] = useState('');
	const { mutate: loginWithInvitationsCode, isPending } = useLoginWithInvitationsCode({
		onSuccess(data) {
			startTransition(() => {
				if (!data.success) {
					addToast({
						description: data.message,
						color: 'danger',
					});
					setCallbackError(data.message);
					return;
				}

				addToast({
					description: data.message,
					color: 'success',
				});
				setCallbackError('');
				router.refresh();
			});
		},
		onError(error) {
			startTransition(() => {
				addToast({
					description: error.message,
					color: 'danger',
				});
				setCallbackError(error.message);
			});
		},
	});
	const handleChange = (value: string) => {
		if (callbackError) {
			setCallbackError('');
		}
		setValue(value.toUpperCase());
	};
	const isDisabled = isPending || !user?.wallet?.address || isLoading;
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
			<ModalBody className="flex flex-col items-center justify-center gap-5 sm:gap-8 px-3 sm:px-0">
				<ModalHeader className="flex flex-col items-center justify-center gap-2 sm:gap-3 pb-0">
					<h3 className="text-xl sm:text-2xl font-medium text-center">{t('title')}</h3>
					<p className="text-sm sm:text-base font-light text-default-500 text-center">{t('subtitle')}</p>
					<span className="text-xs sm:text-sm font-light text-default-500 text-center">
						{t('description', { address: truncateMiddle(user?.wallet?.address ?? '', 10) })}
					</span>
				</ModalHeader>

				<InputOtp
					ref={inputRef}
					length={8}
					allowedKeys={'^[a-zA-Z0-9]+$'}
					classNames={{
						description: 'text-xs text-white text-start',
					}}
					isReadOnly={isDisabled}
					onComplete={code => {
						loginWithInvitationsCode({ code, wallet_address: user?.wallet?.address ?? '' });
					}}
					onValueChange={handleChange}
					value={value}
					isInvalid={!!callbackError}
					autoFocus
				/>
				<ModalFooter className="flex flex-col items-center justify-center gap-8 w-full p-0 mb-3">
					<div className="flex items-center gap-2 w-2/3 sm:w-1/2">
						<Divider className="flex-1" />
						<p className="shrink-0 text-xs text-default-500 mb-0">{t('or')}</p>
						<Divider className="flex-1" />
					</div>
					<Link
						as="button"
						onPress={() =>
							startTransition(async () => {
								await logout();
								router.refresh();
							})
						}
						size="sm"
						isDisabled={isDisabled}
						underline="hover"
					>
						{t('switch-wallet')}
					</Link>
				</ModalFooter>
			</ModalBody>
		</motion.div>
	);
};

export const AuthGuard = ({ isRegistered, isWalletConnected, children, enabled = false }: Props) => {
	const { authenticated, ready } = usePrivy();

	if (enabled) {
		/**
		 * force component to throw promise,
		 * so that the component will refresh token first when it is enabled
		 */
		use(getAccessToken);
	}

	const isAuthenticated = (isWalletConnected || (ready && authenticated)) && isRegistered;

	return (
		<AuthGuardContext value={{ isAuthenticated, enabled, canActivate: !enabled || (enabled && isAuthenticated) }}>
			{children}
			<Modal
				isOpen={!isAuthenticated && enabled}
				classNames={{
					closeButton: 'hidden cursor-default',
					body: 'bg-transparent',
				}}
				backdrop="blur"
				size="lg"
			>
				<ModalContent className="sm:bg-transparent sm:border-none sm:shadow-none pt-5 sm:pt-0">
					<AnimatePresence>
						{!isWalletConnected && (!ready || !authenticated) ? <Welcome /> : <CodeRegister />}
					</AnimatePresence>
				</ModalContent>
			</Modal>
		</AuthGuardContext>
	);
};
