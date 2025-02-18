'use client';

import React from 'react';

import { Image } from '@heroui/image';
import { Select, SelectItem } from '@heroui/select';

import SolanaIcon from '@/components/icons/solana-icon';

interface Network {
	id: number;
	name: string;
	value: string;
	image: string | React.ReactElement;
}

export const networks: Network[] = [
	{
		id: 1,
		name: 'SOL',
		value: 'sol',
		image: <SolanaIcon className="size-6" />,
	},
];

const NetworkSelector = () => {
	return (
		<Select
			aria-label="Network Selector"
			classNames={{
				trigger: 'border-1 p-2',
			}}
			selectionMode="single"
			variant="bordered"
			radius="full"
			selectedKeys={[networks[0].value]}
			defaultSelectedKeys={[networks[0].value]}
			className="min-w-32"
			items={networks}
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
		>
			{network => (
				<SelectItem aria-label={network.name} key={network.value} textValue={network.name}>
					<div className="flex gap-2 items-center">
						{typeof network.image === 'string' ? (
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
						)}
						<div className="flex flex-col">
							<span className="text-small">{network.name}</span>
						</div>
					</div>
				</SelectItem>
			)}
		</Select>
	);
};

export default NetworkSelector;
