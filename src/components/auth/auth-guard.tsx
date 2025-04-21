'use client';

import { use, useTransition } from 'react';

import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { InputOtp } from '@heroui/input-otp';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from '@heroui/modal';
import { addToast } from '@heroui/toast';
import { getAccessToken as _getAccessToken } from '@privy-io/react-auth';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, useTransitionRouter } from 'next-view-transitions';

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
			<ModalBody className="prose prose-invert flex flex-col items-center justify-center text-center mb-5">
				<h2 className="w-2/3">{t('subtitle')}</h2>
				<Donkin className="mb-2" width={150} height={54} />
				<p>{t('description')}</p>
				<Button
					onPress={() =>
						privyLogin({
							loginMethods: ['wallet'],
							walletChainType: 'ethereum-and-solana',
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
	const t = useTranslations('auth.guard.code-register');
	const [isLoading, startTransition] = useTransition();
	const { user, logout } = usePrivy();
	const router = useTransitionRouter();
	const { mutate: loginWithInvitationsCode, isPending } = useLoginWithInvitationsCode({
		onSuccess(data) {
			if (!data.success) {
				addToast({
					description: data.message,
					color: 'danger',
				});
				return;
			}

			addToast({
				description: data.message,
				color: 'success',
			});
			router.refresh();
		},
		onError(error) {
			addToast({
				description: error.message,
				color: 'danger',
			});
		},
	});
	const isDisabled = isPending || !user?.wallet?.address || isLoading;
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
			<ModalBody className="flex flex-col items-center justify-center gap-2">
				<ModalHeader className="flex flex-col items-center justify-center gap-2">
					{t('title')}
					<p className="text-xs text-default-500">{t('subtitle')}</p>
				</ModalHeader>

				<InputOtp
					length={8}
					allowedKeys={'^[a-zA-Z0-9]+$'}
					description={t('description', { address: truncateMiddle(user?.wallet?.address ?? '', 10) })}
					classNames={{
						description: 'text-xs text-white text-start',
					}}
					isDisabled={isDisabled}
					onComplete={code => {
						loginWithInvitationsCode({ code, wallet_address: user?.wallet?.address ?? '' });
					}}
				/>
				<div className="flex items-center gap-2 w-2/3">
					<Divider className="flex-1" />
					<p className="shrink-0 text-tiny text-default-500 mb-0">{t('or')}</p>
					<Divider className="flex-1" />
				</div>
				<Button
					onPress={() =>
						startTransition(async () => {
							await logout();
							router.refresh();
						})
					}
					size="sm"
					variant="light"
					isDisabled={isDisabled}
				>
					{t('switch-wallet')}
				</Button>
			</ModalBody>
		</motion.div>
	);
};

export const AuthGuard = ({ isRegistered, isWalletConnected, children, enabled = false }: Props) => {
	const t = useTranslations('footer');
	const { authenticated, ready } = usePrivy();

	if (!enabled) {
		return children;
	}

	use(getAccessToken);

	const isAuthenticated = (isWalletConnected || (ready && authenticated)) && isRegistered;

	return (
		<>
			{children}
			<Modal
				isOpen={!isAuthenticated}
				classNames={{
					closeButton: 'hidden cursor-default',
					body: 'bg-transparent',
				}}
				backdrop="blur"
			>
				<ModalContent className="sm:bg-transparent sm:border-none sm:shadow-none prose-invert">
					<AnimatePresence>
						{!isWalletConnected && (!ready || !authenticated) ? <Welcome /> : <CodeRegister />}
					</AnimatePresence>
					<ModalFooter className="flex w-full justify-center">
						<section className="flex gap-1 items-center">
							<Link className="text-[10px] leading-[12px] w-fit" href="#">
								{t('about')}
							</Link>
							<Divider orientation="vertical" className="h-4" />
							<Link className="text-[10px] leading-[12px] w-fit" href="#">
								{t('privacy')}
							</Link>
							<Divider orientation="vertical" className="h-4" />
							<Link className="text-[10px] leading-[12px] w-fit" href="#">
								{t('contact')}
							</Link>
						</section>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
