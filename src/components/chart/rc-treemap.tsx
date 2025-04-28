'use client';

import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

import DonkinPopover from '../donkin/popover';

interface CryptoData {
	name: string;
	value: number;
}

interface Props {
	data: CryptoData[];
}

const RCTreemap = ({ data }: Props) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<Treemap data={data} width={800} height={400} dataKey="value" nameKey="name" isAnimationActive={false}>
				<Tooltip
					active
					// wrapperStyle={{
					// 	pointerEvents: 'auto',
					// }}
					content={<DonkinPopover askMore={['test']} />}
					isAnimationActive={false}
				/>
			</Treemap>
		</ResponsiveContainer>
	);
};

export default RCTreemap;
