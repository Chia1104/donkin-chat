import { useMemo } from 'react';

import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { Modal, useDisclosure, ModalContent, ModalBody } from '@heroui/modal';
import { useLogin } from '@privy-io/react-auth';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@solana/wallet-adapter-react';
import NextImage from 'next/image';
import { useConnect } from 'wagmi';

import { SupportedVM } from '@/libs/web3/enums/supportedVM.enum';
import { ConnectorID } from '@/libs/web3/enums/wallet.enum';
import { useWeb3Store } from '@/stores/web3/store';

import CoinbaseIcon from '../icons/coin-base-icon';
import MetaMaskIcon from '../icons/meta-mask-icon';

interface Props {
	vm?: SupportedVM;
	privy?: boolean;
}

const Icon = ({ id }: { id: string }) => {
	switch (id) {
		case ConnectorID.Coinbase:
			return <CoinbaseIcon className="size-5" />;
		case ConnectorID.MetaMask:
			return <MetaMaskIcon className="size-5" />;
		case ConnectorID.Bitget:
			return (
				<Image
					as={NextImage}
					src="/assets/images/bitget-wallet-logo-circle.png"
					width={20}
					height={20}
					alt="bitget-wallet"
					aria-label="bitget-wallet"
				/>
			);
		default:
			return <Image as={NextImage} src={id} width={20} height={20} alt="wallet" aria-label="wallet" />;
	}
};

const WalletConnect = (props: Props) => {
	const { vm: currentVM } = useWeb3Store();

	const { vm = currentVM, privy = true } = props;
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { connectors, connect, reset } = useConnect();
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { wallets, select: solanaSelect, connect: solanaConnect, disconnect: solanaDisconnect } = useWallet();

	const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
	const { login: privyLogin } = useLogin();

	const walletList = useMemo(() => {
		switch (vm) {
			case SupportedVM.EVM:
				return (
					<>
						{connectors.map(connector => (
							<Button
								key={connector.id}
								onPress={() => {
									connect({ connector });
									void solanaDisconnect();
								}}
								aria-label={connector.name}
								startContent={<Icon id={connector.icon ?? connector.id} />}
							>
								{connector.name}
							</Button>
						))}
					</>
				);
			case SupportedVM.SVM:
				return (
					<>
						{wallets.map(wallet => (
							<Button
								key={wallet.adapter.name}
								onPress={() => {
									/**
									 * TODO: implement solana connect function
									 */
									solanaSelect(wallet.adapter.name);
									void solanaConnect();
									reset();
								}}
								aria-label={wallet.adapter.name}
								startContent={<Icon id={wallet.adapter.icon} />}
							>
								{wallet.adapter.name}
							</Button>
						))}
					</>
				);
			default:
				return null;
		}
	}, [connect, connectors, reset, solanaConnect, solanaDisconnect, solanaSelect, vm, wallets]);

	const handleConnect = () => {
		if (privy) {
			privyLogin({
				loginMethods: ['wallet'],
				// walletChainType: vm === 'SVM' ? 'solana-only' : 'ethereum-only',
				disableSignup: false,
			});
			return;
		}

		onOpen();
	};

	return (
		<>
			<Button
				onPress={handleConnect}
				isDisabled={privy && (!privyReady || (privyReady && privyAuthenticated))}
				aria-label="Connect Wallet"
				className="rounded-full"
				isIconOnly
				variant="bordered"
			>
				<Image src="/assets/images/wallet.svg" width={24} height={24} alt="wallet" aria-label="wallet" />
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="p-5">
					<ModalBody>{walletList}</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WalletConnect;
