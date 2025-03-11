'use client';

import React from 'react';

import { Image } from '@heroui/image';
import { Select, SelectItem } from '@heroui/select';

import BNBIcon from '@/components/icons/bnb-icon';
import EthereumIcon from '@/components/icons/ethereum-icon';
import SolanaIcon from '@/components/icons/solana-icon';
import type { EVMChainID } from '@/libs/web3/enums/chain.enum';
import { ChainSymbol } from '@/libs/web3/enums/chain.enum';
import { useWeb3Store } from '@/stores/web3/store';

interface Chain {
	id: string;
	name: string;
	value: number | string;
	image: string | React.ReactElement;
}

const ChainIcon = ({ symbol }: { symbol: ChainSymbol }) => {
	switch (symbol) {
		case ChainSymbol.ETH:
			return <EthereumIcon className="size-6" />;
		case ChainSymbol.BNB:
			return <BNBIcon className="size-6" />;
		case ChainSymbol.SOL:
			return <SolanaIcon className="size-6" />;
		default:
			return null;
	}
};

const ChainSelector = () => {
	const { supportedVM, chainId, switchChain } = useWeb3Store();

	const chains: Chain[] = React.useMemo(() => {
		return supportedVM.map(vm => ({
			id: `${vm.chainId}`,
			name: vm.chainName,
			value: vm.chainId,
			image: <ChainIcon symbol={vm.symbol} />,
			data: vm,
		}));
	}, [supportedVM]);
	return (
		<Select
			aria-label="Network Selector"
			classNames={{
				trigger:
					'border-1 p-2 border-default data-[hover=true]:border-default data-[open=true]:border-default data-[focus=true]:border-default',
				popoverContent: 'bg-[rgba(28,_38,_51,_1)] shadow-none rounded-sm px-0',
				listbox: 'px-0',
			}}
			selectionMode="single"
			variant="bordered"
			radius="full"
			defaultSelectedKeys={[`${chainId}`]}
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
			onChange={e => switchChain(Number(e.target.value) as unknown as EVMChainID)}
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
