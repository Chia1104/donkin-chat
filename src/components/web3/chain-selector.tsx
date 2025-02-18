'use client';

import React from 'react';

import { Image } from '@heroui/image';
import { Select, SelectItem } from '@heroui/select';
import { useSwitchChain, useChainId } from 'wagmi';

import BNBIcon from '@/components/icons/bnb-icon';
import EthereumIcon from '@/components/icons/ethereum-icon';
import SolanaIcon from '@/components/icons/solana-icon';

interface Chain {
	id: number;
	name: string;
	value: number | string;
	image: string | React.ReactElement;
}

type WagmiChainId = 1 | 56;

const ChainIcon = ({ symbol }: { symbol: 'ETH' | 'BNB' | 'SOL' }) => {
	switch (symbol) {
		case 'ETH':
			return <EthereumIcon className="size-6" />;
		case 'BNB':
			return <BNBIcon className="size-6" />;
		case 'SOL':
			return <SolanaIcon className="size-6" />;
		default:
			return null;
	}
};

const ChainSelector = () => {
	const currentChainId = useChainId();
	const { chains: wagmiChains, switchChain } = useSwitchChain();
	const chains: Chain[] = React.useMemo(() => {
		return [
			{
				id: 900,
				name: 'SOL',
				value: 900,
				image: <ChainIcon symbol="SOL" />,
			},
		].concat(
			wagmiChains.map(chain => ({
				id: chain.id,
				name: chain.nativeCurrency.symbol,
				value: chain.id,
				image: <ChainIcon symbol={chain.nativeCurrency.symbol} />,
			})),
		);
	}, [wagmiChains]);
	return (
		<Select
			aria-label="Network Selector"
			classNames={{
				trigger: 'border-1 p-2',
			}}
			selectionMode="single"
			variant="bordered"
			radius="full"
			defaultSelectedKeys={[currentChainId]}
			className="min-w-32"
			items={chains}
			placeholder="Select a network"
			renderValue={items => {
				return items.map(item =>
					item.data ? (
						<div key={item.key} className="flex items-center gap-2">
							{typeof item.data.image === 'string' ? (
								<Image
									aria-label={item.data.name}
									alt={item.data.name}
									className="flex-shrink-0"
									width={24}
									height={24}
									src={item.data.image}
								/>
							) : (
								item.data.image
							)}
							<div className="flex flex-col">
								<span>{item.data.name}</span>
							</div>
						</div>
					) : null,
				);
			}}
			onSelectionChange={key => switchChain({ chainId: key as unknown as WagmiChainId })}
		>
			{network => (
				<SelectItem
					aria-label={network.name}
					key={network.id}
					textValue={network.name}
					startContent={
						typeof network.image === 'string' ? (
							<Image
								aria-label={network.name}
								alt={network.name}
								className="flex-shrink-0"
								width={24}
								height={24}
								src={network.image}
							/>
						) : (
							network.image
						)
					}
				>
					<span className="text-small line-clamp-1">{network.name}</span>
				</SelectItem>
			)}
		</Select>
	);
};

export default ChainSelector;
