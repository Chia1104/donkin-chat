import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { Modal, useDisclosure, ModalContent, ModalBody } from '@heroui/modal';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { useConnect } from 'wagmi';

import CoinbaseIcon from '../icons/coin-base-icon';
import MetaMaskIcon from '../icons/meta-mask-icon';

const Icon = ({ id }: { id: string }) => {
	switch (id) {
		case 'coinbaseWalletSDK':
			return <CoinbaseIcon className="size-5" />;
		case 'metaMaskSDK':
			return <MetaMaskIcon className="size-5" />;
		case 'com.bitget.web3':
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
			return null;
	}
};

const WalletConnect = () => {
	const tAction = useTranslations('action');
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { connectors, connect } = useConnect();
	return (
		<>
			<Button
				onPress={onOpen}
				aria-label="Connect Wallet"
				color="primary"
				className="rounded-full"
				startContent={<AccountBalanceWalletOutlinedIcon />}
			>
				{tAction('connect-wallet')}
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="p-5">
					<ModalBody>
						{connectors.map(connector => (
							<Button
								key={connector.id}
								onPress={() => connect({ connector })}
								aria-label={connector.name}
								startContent={<Icon id={connector.id} />}
							>
								{connector.name}
							</Button>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WalletConnect;
