'use client';

import dynamic from 'next/dynamic';

import { QueryType } from '@/libs/ai/enums/queryType.enum';
import { useAISearchParams } from '@/libs/ai/hooks/useAISearchParams';

const TokensList = dynamic(() => import('@/containers/token/tokens-list'));
const Heatmap = dynamic(() => import('@/containers/token/heatmap'));

const Content = () => {
	const [searchParams] = useAISearchParams();

	switch (searchParams.q) {
		case QueryType.Tokens:
			return <TokensList />;
		case QueryType.Heatmap:
			return <Heatmap />;
		default:
			return null;
	}
};

const TokenPage = () => {
	return (
		<>
			<Content />
		</>
	);
};

export default TokenPage;
